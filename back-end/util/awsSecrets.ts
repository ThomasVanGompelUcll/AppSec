import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const region = process.env.AWS_DEFAULT_REGION || 'eu-central-1'; // Ensure this matches your AWS region
const client = new SecretsManagerClient({ region });

export const getSecret = async (secretName: string): Promise<string | undefined> => {
  try {
    console.log(`Attempting to retrieve secret: ${secretName}`);
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (response.SecretString) {
      return response.SecretString;
    } else {
      console.error('Secret binary data is not supported.');
      return undefined;
    }
  } catch (error) {
    console.error(`Failed to retrieve secret: ${(error as Error).message}`);
    return undefined;
  }
};
