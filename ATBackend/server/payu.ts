import crypto from 'crypto';

interface PayUConfig {
  key: string;
  salt: string;
  environment: string;
  clientSecret: string;
  merchantId: string;
}

interface PaymentData {
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  surl: string;
  furl: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export class PayUService {
  private config: PayUConfig;

  constructor() {
    this.config = {
      key: process.env.PAYU_KEY || '',
      salt: process.env.PAYU_SALT || '',
      environment: process.env.PAYU_ENVIRONMENT || 'https://test.payu.in/_payment',
      clientSecret: process.env.PAYU_CLIENT_SECRET || '',
      merchantId: process.env.PAYU_MERCHANT_ID || ''
    };

    if (!this.config.key || !this.config.salt) {
      console.log('Available env vars:', {
        key: !!process.env.PAYU_KEY,
        salt: !!process.env.PAYU_SALT,
        env: !!process.env.PAYU_ENVIRONMENT,
        secret: !!process.env.PAYU_CLIENT_SECRET,
        merchant: !!process.env.PAYU_MERCHANT_ID
      });
      throw new Error('PayU credentials not configured properly');
    }
  }

  generateHash(data: PaymentData): string {
    const hashString = `${this.config.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}||||||${this.config.salt}`;
    
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  verifyPayment(postData: any): boolean {
    const { status, txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5, hash } = postData;
    
    const reverseHashString = `${this.config.salt}|${status}||||||${udf5 || ''}|${udf4 || ''}|${udf3 || ''}|${udf2 || ''}|${udf1 || ''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${this.config.key}`;
    
    const expectedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');
    
    return hash === expectedHash;
  }

  createPaymentForm(data: PaymentData): string {
    const hash = this.generateHash(data);
    
    return `
      <form id="payuForm" action="${this.config.environment}" method="post">
        <input type="hidden" name="key" value="${this.config.key}" />
        <input type="hidden" name="txnid" value="${data.txnid}" />
        <input type="hidden" name="amount" value="${data.amount}" />
        <input type="hidden" name="productinfo" value="${data.productinfo}" />
        <input type="hidden" name="firstname" value="${data.firstname}" />
        <input type="hidden" name="email" value="${data.email}" />
        <input type="hidden" name="phone" value="${data.phone || ''}" />
        <input type="hidden" name="surl" value="${data.surl}" />
        <input type="hidden" name="furl" value="${data.furl}" />
        <input type="hidden" name="hash" value="${hash}" />
        <input type="hidden" name="udf1" value="${data.udf1 || ''}" />
        <input type="hidden" name="udf2" value="${data.udf2 || ''}" />
        <input type="hidden" name="udf3" value="${data.udf3 || ''}" />
        <input type="hidden" name="udf4" value="${data.udf4 || ''}" />
        <input type="hidden" name="udf5" value="${data.udf5 || ''}" />
      </form>
      <script>
        document.getElementById('payuForm').submit();
      </script>
    `;
  }

  generateTxnId(): string {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  }

  createPaymentData(
    amount: number,
    userDetails: { name: string; email: string; phone?: string },
    productInfo: string,
    successUrl: string,
    failureUrl?: string,
    udf1?: string
  ): PaymentData {
    return {
      txnid: this.generateTxnId(),
      amount,
      productinfo: productInfo,
      firstname: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      surl: successUrl,
      furl: failureUrl || successUrl.replace('/success', '/failure'),
      udf1: udf1 || ''
    };
  }
}

let payuServiceInstance: PayUService | null = null;

export const payuService = {
  getInstance(): PayUService {
    if (!payuServiceInstance) {
      payuServiceInstance = new PayUService();
    }
    return payuServiceInstance;
  },
  
  generateHash(data: PaymentData): string {
    return this.getInstance().generateHash(data);
  },
  
  verifyPayment(postData: any): boolean {
    return this.getInstance().verifyPayment(postData);
  },
  
  createPaymentForm(data: PaymentData): string {
    return this.getInstance().createPaymentForm(data);
  },
  
  generateTxnId(): string {
    return this.getInstance().generateTxnId();
  },
  
  createPaymentData(
    amount: number,
    userDetails: { name: string; email: string; phone?: string },
    productInfo: string,
    successUrl: string,
    failureUrl?: string,
    udf1?: string
  ): PaymentData {
    return this.getInstance().createPaymentData(amount, userDetails, productInfo, successUrl, failureUrl, udf1);
  }
};