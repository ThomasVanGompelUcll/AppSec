class UserWallet {
    private userId: string;
    private walletId: string;
  
    constructor(userId: string, walletId: string) {
      this.userId = userId;
      this.walletId = walletId;
    }
  
    getUserId(): string {
      return this.userId;
    }
  
    getWalletId(): string {
      return this.walletId;
    }
  
    setUserId(userId: string) {
      this.userId = userId;
    }
  
    setWalletId(walletId: string) {
      this.walletId = walletId;
    }
  }