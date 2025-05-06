import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from pathlib import Path
import jwt
import datetime
from jwt.exceptions import ExpiredSignatureError, ImmatureSignatureError, InvalidIssuedAtError

load_dotenv('/backend/.env')

def generate_strong_secret():
    """Generate a 256-bit (32-byte) strong secret."""
    return os.urandom(32)

def validate_aws_credentials():
    """Validate that AWS credentials are set in the environment or in the AWS credentials file."""
    if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
        aws_credentials_file = Path.home() / ".aws" / "credentials"
        if not aws_credentials_file.exists():
            raise Exception(
                "AWS credentials are not set. Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY "
                "as environment variables or set up the AWS credentials file at ~/.aws/credentials. "
                "Refer to https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html for guidance."
            )

def validate_kms_key_alias(key_alias, region):
    """Validate that the specified KMS key alias exists in AWS KMS."""
    kms_client = boto3.client('kms', region_name=region)
    try:
        aliases = kms_client.list_aliases()['Aliases']
        if not aliases:
            raise Exception(
                f"No KMS aliases found in region '{region}'. Please create an alias using the AWS CLI:\n"
                f"aws kms create-alias --alias-name alias/{key_alias} --target-key-id <key-id> --region {region}"
            )
        if not any(alias['AliasName'] == f'alias/{key_alias}' for alias in aliases):
            raise Exception(
                f"The specified KMS key alias '{key_alias}' was not found in region '{region}'. "
                "Please ensure the alias exists in AWS KMS."
            )
    except ClientError as e:
        if e.response['Error']['Code'] == 'AccessDeniedException':
            raise Exception(
                "Access denied while trying to list or create KMS aliases. Ensure your IAM user has the necessary permissions, including 'kms:CreateKey' and 'kms:CreateAlias'."
            )
        raise Exception(f"An error occurred while validating the KMS key alias: {e}")

def store_secret_in_aws_kms(secret, key_alias):
    """
    Store the secret in AWS KMS.
    :param secret: The secret to store.
    :param key_alias: The KMS key alias to use for encryption.
    """
    validate_aws_credentials()
    region = os.getenv('AWS_DEFAULT_REGION', 'eu-central-1')
    validate_kms_key_alias(key_alias, region) 
    kms_client = boto3.client('kms', region_name=region) 
    try:
        response = kms_client.encrypt(
            KeyId=f'alias/{key_alias}',
            Plaintext=secret
        )
        return response['CiphertextBlob']
    except kms_client.exceptions.NotFoundException:
        raise Exception(
            f"The specified KMS key alias '{key_alias}' was not found in region '{region}'. "
            "Please ensure the alias exists in AWS KMS. You can create it using the AWS CLI:\n"
            f"aws kms create-alias --alias-name alias/{key_alias} --target-key-id <key-id> --region {region}"
        )
    except NoCredentialsError:
        raise Exception("AWS credentials not found. Configure them before using this function.")

def rotate_secret():
    """Rotate the secret by generating a new one and storing it securely."""
    new_secret = generate_strong_secret()
    encrypted_secret = store_secret_in_aws_kms(new_secret, 'Application_security_r0943966')
    print("Secret rotated and stored securely.")
    return encrypted_secret

def generate_token(secret_key, expiration_minutes=15):
    """
    Generate a JWT token with exp, iat, and nbf claims.
    Avoid storing sensitive data in the payload.
    :param secret_key: The secret key to sign the token.
    :param expiration_minutes: Token expiration time in minutes.
    :return: Encoded JWT token.
    """
    now = datetime.datetime.utcnow()
    payload = {
        'exp': now + datetime.timedelta(minutes=expiration_minutes),
        'iat': now,
        'nbf': now,

        'role': 'user',
        'permissions': ['read', 'write'] 
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')

def validate_token(token, secret_key):
    """
    Validate a JWT token by checking its exp, iat, and nbf claims.
    :param token: The JWT token to validate.
    :param secret_key: The secret key to decode the token.
    :return: Decoded payload if valid.
    :raises: Exception if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except ExpiredSignatureError:
        raise Exception("Token has expired.")
    except ImmatureSignatureError:
        raise Exception("Token is not yet valid (nbf claim).")
    except InvalidIssuedAtError:
        raise Exception("Invalid issued at (iat claim).")
    except Exception as e:
        raise Exception(f"Token validation failed: {e}")

if __name__ == "__main__":
    secret = generate_strong_secret()
    print(f"Generated Secret: {secret.hex()}")
    encrypted_secret = store_secret_in_aws_kms(secret, 'Application_security_r0943966')
    print(f"Encrypted Secret: {encrypted_secret}")

    secret_key = generate_strong_secret()
    token = generate_token(secret_key)
    print(f"Generated Token: {token}")

    try:
        decoded_payload = validate_token(token, secret_key)
        print(f"Token is valid. Payload: {decoded_payload}")
    except Exception as e:
        print(f"Token validation failed: {e}")
