import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  Smartphone,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useCurrencyStore } from '../stores/useCurrencyStore';
import { formatPrice, getPriceAmount } from '../utils/formatCurrency';
import type { OrderReceipt } from '../types';

// Step validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State or province is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type PaymentType = 'upi' | 'card' | 'netbanking' | 'cod';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getSubtotal, getTaxes, getGrandTotal, clearCart } = useCartStore();
  const { selectedCurrency } = useCurrencyStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Payment method state
  const [paymentType, setPaymentType] = useState<PaymentType>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  
  // Card state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      country: selectedCurrency.symbol === '₹' ? 'India' : 'United States',
      postalCode: '',
    },
    mode: 'onTouched',
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl text-primary font-normal">Shopping Bag is Empty</h1>
        <p className="text-xs text-secondary leading-relaxed">
          You cannot initiate checkout with an empty bag. Please add garments to proceed.
        </p>
        <Link
          to="/collections"
          className="inline-block bg-primary text-surface px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal(selectedCurrency.symbol);
  const taxes = getTaxes(selectedCurrency.symbol);
  const grandTotal = getGrandTotal(selectedCurrency.symbol);

  // Validate step 1 fields before proceeding to step 2
  const handleProceedToStep2 = async () => {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
    if (isValid) setCurrentStep(2);
  };

  // Validate step 2 fields before proceeding to step 3
  const handleProceedToStep3 = async () => {
    const isValid = await trigger(['street', 'city', 'state', 'country', 'postalCode']);
    if (isValid) setCurrentStep(3);
  };

  // Quick fill demo card
  const handleFillDemoCard = () => {
    setCardHolder(getValues('firstName') + ' ' + getValues('lastName') || 'Abhishek Yadav');
    setCardNumber('4111 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvv('888');
  };

  // Determine final payment description string
  const getPaymentSummaryString = () => {
    if (paymentType === 'upi') {
      const providerLabel =
        upiProvider === 'gpay'
          ? 'Google Pay UPI'
          : upiProvider === 'phonepe'
          ? 'PhonePe UPI'
          : upiProvider === 'paytm'
          ? 'Paytm UPI'
          : `Custom UPI (${customUpiId || 'user@upi'})`;
      return `UPI Instant (${providerLabel})`;
    }
    if (paymentType === 'card') {
      return `Credit / Debit Card (${cardNumber || 'Card ending in 4242'})`;
    }
    if (paymentType === 'netbanking') {
      return `Net Banking (${selectedBank})`;
    }
    return 'Cash on Delivery (Pay upon arrival)';
  };

  // Complete simulated order
  const onFinalSubmit = (data: CheckoutFormData) => {
    const demoOrderId = 'ELAN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const paymentSummary = getPaymentSummaryString();
    const paymentDetailInfo =
      paymentType === 'upi'
        ? `UPI ID: ${customUpiId || data.phone + '@upi'}`
        : paymentType === 'card'
        ? `Cardholder: ${cardHolder || data.firstName + ' ' + data.lastName}`
        : paymentType === 'netbanking'
        ? `Bank: ${selectedBank}`
        : 'Cash upon delivery';

    const receipt: OrderReceipt = {
      orderId: demoOrderId,
      orderDate,
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      },
      items: [...cart],
      currencySymbol: selectedCurrency.symbol,
      subtotal,
      taxes,
      total: grandTotal,
      paymentMethod: paymentSummary,
      paymentDetails: paymentDetailInfo,
    };

    // Construct structured WhatsApp order text
    const itemsText = receipt.items
      .map((item, index) => {
        const itemPrice = getPriceAmount(item.prices, receipt.currencySymbol);
        const options = item.userSelectedAttributes
          .map((a) => `${a.attributeId}: ${a.attributeValue}`)
          .join(', ');
        return `${index + 1}. *${item.name}*\n   • Qty: ${item.quantity}\n   • ${options}\n   • Price: ${receipt.currencySymbol}${itemPrice * item.quantity}`;
      })
      .join('\n\n');

    const whatsappMessage =
      `*🛍️ NEW ORDER PLACED — ÉLAN ATELIER*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Order Reference:* ${receipt.orderId}\n` +
      `*Date:* ${receipt.orderDate}\n` +
      `*Payment Method:* ${receipt.paymentMethod}\n` +
      `*Payment Details:* ${paymentDetailInfo}\n` +
      `\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Name: ${receipt.customer.firstName} ${receipt.customer.lastName}\n` +
      `• Email: ${receipt.customer.email}\n` +
      `• Mobile: ${receipt.customer.phone}\n` +
      `\n` +
      `📍 *DELIVERY DESTINATION:*\n` +
      `${receipt.shippingAddress.street}, ${receipt.shippingAddress.city}, ${receipt.shippingAddress.state} - ${receipt.shippingAddress.postalCode}, ${receipt.shippingAddress.country}\n` +
      `\n` +
      `👗 *ORDERED GARMENTS (${receipt.items.length}):*\n` +
      `${itemsText}\n` +
      `\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *FINANCIAL SUMMARY:*\n` +
      `• Subtotal: ${receipt.currencySymbol}${receipt.subtotal.toFixed(2)}\n` +
      `• VAT / Taxes (21%): ${receipt.currencySymbol}${receipt.taxes.toFixed(2)}\n` +
      `• Shipping: Complimentary Express\n` +
      `• *GRAND TOTAL: ${receipt.currencySymbol}${receipt.total.toFixed(2)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Order placed directly via ÉLAN Storefront._`;

    const targetWhatsappNumber = '919131494302';
    const whatsappUrl = `https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Store receipt snapshot in sessionStorage so clearing cart doesn't erase it
    sessionStorage.setItem('elan-latest-receipt', JSON.stringify(receipt));

    // Directly open WhatsApp with order details in new tab/app
    window.open(whatsappUrl, '_blank');

    // Clear cart and route to order confirmation
    clearCart();
    navigate('/order');
  };

  return (
    <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-10">
      
      {/* Title & Wizard Step Indicator */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">Guest Checkout</h1>
        <p className="text-xs uppercase tracking-luxury text-secondary mt-1">Complete your atelier order</p>

        {/* Step Tabs */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 mt-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 1 ? 'bg-primary text-surface' : 'bg-border text-secondary'
              }`}
            >
              1
            </span>
            <span className={`text-xs uppercase tracking-subtle hidden sm:inline ${currentStep === 1 ? 'font-semibold text-primary' : 'text-secondary'}`}>
              Contact
            </span>
          </div>

          <div className="w-8 h-[1px] bg-border" />

          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 2 ? 'bg-primary text-surface' : 'bg-border text-secondary'
              }`}
            >
              2
            </span>
            <span className={`text-xs uppercase tracking-subtle hidden sm:inline ${currentStep === 2 ? 'font-semibold text-primary' : 'text-secondary'}`}>
              Delivery
            </span>
          </div>

          <div className="w-8 h-[1px] bg-border" />

          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === 3 ? 'bg-primary text-surface' : 'bg-border text-secondary'
              }`}
            >
              3
            </span>
            <span className={`text-xs uppercase tracking-subtle hidden sm:inline ${currentStep === 3 ? 'font-semibold text-primary' : 'text-secondary'}`}>
              Payment Options
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
        
        {/* Left: Step Form */}
        <div className="lg:col-span-7 bg-surface border border-border p-6 sm:p-8">
          <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
            
            {/* STEP 1: CONTACT INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="font-serif text-xl text-primary font-medium">1. Contact Information</h2>
                  <p className="text-xs text-secondary mt-0.5">We will send dispatch confirmation & WhatsApp receipt here.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="Abhishek"
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-error mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="Yadav"
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-error mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-error mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                    placeholder="9131494302"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-error mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="w-full py-3.5 bg-primary text-surface text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY ADDRESS */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="font-serif text-xl text-primary font-medium">2. Delivery Address</h2>
                  <p className="text-xs text-secondary mt-0.5">Enter the destination for your curated garments.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                    Street Address & Apartment
                  </label>
                  <input
                    type="text"
                    {...register('street')}
                    className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                    placeholder="Flat 402, High Street"
                  />
                  {errors.street && (
                    <p className="text-[11px] text-error mt-1">{errors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="New Delhi"
                    />
                    {errors.city && (
                      <p className="text-[11px] text-error mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      {...register('state')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="Delhi"
                    />
                    {errors.state && (
                      <p className="text-[11px] text-error mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="India"
                    />
                    {errors.country && (
                      <p className="text-[11px] text-error mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-secondary font-medium mb-1">
                      Postal Code / PIN
                    </label>
                    <input
                      type="text"
                      {...register('postalCode')}
                      className="w-full bg-background border border-border px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-primary"
                      placeholder="110001"
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-error mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 py-3.5 border border-border text-secondary text-xs uppercase tracking-luxury font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="w-2/3 py-3.5 bg-primary text-surface text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Choose Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT OPTIONS & SIMULATION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-border pb-3">
                  <h2 className="font-serif text-xl text-primary font-medium">3. Payment Method Simulation</h2>
                  <p className="text-xs text-secondary mt-0.5">Select your preferred payment method. All options are fully simulated.</p>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('upi')}
                    className={`p-3 border text-xs flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      paymentType === 'upi'
                        ? 'border-primary bg-primary text-surface font-semibold shadow-subtle'
                        : 'border-border bg-background text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`p-3 border text-xs flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      paymentType === 'card'
                        ? 'border-primary bg-primary text-surface font-semibold shadow-subtle'
                        : 'border-border bg-background text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('netbanking')}
                    className={`p-3 border text-xs flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      paymentType === 'netbanking'
                        ? 'border-primary bg-primary text-surface font-semibold shadow-subtle'
                        : 'border-border bg-background text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('cod')}
                    className={`p-3 border text-xs flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      paymentType === 'cod'
                        ? 'border-primary bg-primary text-surface font-semibold shadow-subtle'
                        : 'border-border bg-background text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Pay on Delivery</span>
                  </button>
                </div>

                {/* OPTION 1: UPI / QR SIMULATION */}
                {paymentType === 'upi' && (
                  <div className="p-4 border border-border bg-background/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-luxury font-semibold text-primary">
                        Instant UPI Payment
                      </span>
                      <span className="text-[10px] text-olive-dark bg-olive/10 px-2 py-0.5 rounded font-medium">
                        Zero Processing Fee
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUpiProvider('gpay')}
                        className={`p-2 border text-xs flex items-center justify-center space-x-1 transition-colors ${
                          upiProvider === 'gpay'
                            ? 'bg-surface border-primary font-semibold text-primary shadow-xs'
                            : 'bg-surface/50 border-border text-secondary'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiProvider('phonepe')}
                        className={`p-2 border text-xs flex items-center justify-center space-x-1 transition-colors ${
                          upiProvider === 'phonepe'
                            ? 'bg-surface border-primary font-semibold text-primary shadow-xs'
                            : 'bg-surface/50 border-border text-secondary'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                        <span>PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiProvider('paytm')}
                        className={`p-2 border text-xs flex items-center justify-center space-x-1 transition-colors ${
                          upiProvider === 'paytm'
                            ? 'bg-surface border-primary font-semibold text-primary shadow-xs'
                            : 'bg-surface/50 border-border text-secondary'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                        <span>Paytm UPI</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-surface border border-border">
                      <div className="w-20 h-20 bg-background flex flex-col items-center justify-center border border-border flex-shrink-0">
                        <QrCode className="w-12 h-12 text-primary stroke-1" />
                        <span className="text-[9px] text-secondary mt-0.5">Demo QR</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="font-medium text-primary">Scan with any UPI App or Enter VPA</p>
                        <p className="text-secondary text-[11px]">
                          Accepts GPay, PhonePe, Paytm, BHIM, Cred and all Indian banking apps.
                        </p>
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={(e) => {
                            setCustomUpiId(e.target.value);
                            setUpiProvider('custom');
                          }}
                          placeholder="e.g. 9131494302@upi"
                          className="w-full mt-2 bg-background border border-border px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* OPTION 2: CARD SIMULATION */}
                {paymentType === 'card' && (
                  <div className="p-4 border border-border bg-background/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-luxury font-semibold text-primary">
                        Credit / Debit Card (Visa, Mastercard, RuPay)
                      </span>
                      <button
                        type="button"
                        onClick={handleFillDemoCard}
                        className="text-[11px] text-sand-dark hover:text-primary flex items-center space-x-1 font-medium transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Fill Demo Card</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-luxury text-secondary font-medium mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Abhishek Yadav"
                          className="w-full bg-surface border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-luxury text-secondary font-medium mb-1">
                          16-Digit Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 •••• •••• 4242"
                          className="w-full bg-surface border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-luxury text-secondary font-medium mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-surface border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-luxury text-secondary font-medium mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={4}
                            placeholder="•••"
                            className="w-full bg-surface border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* OPTION 3: NET BANKING */}
                {paymentType === 'netbanking' && (
                  <div className="p-4 border border-border bg-background/50 space-y-4">
                    <span className="text-xs uppercase tracking-luxury font-semibold text-primary block">
                      Select Popular Indian Bank
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-2.5 border text-xs text-left transition-colors flex items-center justify-between ${
                            selectedBank === b
                              ? 'bg-surface border-primary font-semibold text-primary shadow-xs'
                              : 'bg-surface/60 border-border text-secondary hover:border-primary'
                          }`}
                        >
                          <span className="truncate">{b}</span>
                          {selectedBank === b && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* OPTION 4: CASH ON DELIVERY */}
                {paymentType === 'cod' && (
                  <div className="p-4 border border-border bg-background/50 space-y-2 text-xs">
                    <span className="uppercase tracking-luxury font-semibold text-primary block">
                      Pay on Delivery / Doorstep Payment
                    </span>
                    <p className="text-secondary leading-relaxed">
                      You can inspect your curated garments upon arrival and pay via Cash or UPI QR to the delivery courier.
                    </p>
                  </div>
                )}

                {/* Recipient & Destination Preview */}
                <div className="bg-background p-3.5 border border-border text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-secondary">Destination:</span>
                    <span className="text-primary font-medium text-right max-w-xs">
                      {getValues('street')}, {getValues('city')}, {getValues('postalCode')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Payment Method:</span>
                    <span className="text-primary font-semibold">{getPaymentSummaryString()}</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-3 bg-olive/10 border border-olive/30 text-xs text-olive-dark flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-olive flex-shrink-0" />
                  <span>Demonstration Mode: Zero real charges. Instant WhatsApp receipt will be prepared.</span>
                </div>

                <div className="pt-2 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-1/3 py-3.5 border border-border text-secondary text-xs uppercase tracking-luxury font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 bg-primary text-surface text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order & Generate Receipt</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg text-primary font-medium pb-3 border-b border-border">
              Bag Summary ({cart.length})
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const itemPrice = getPriceAmount(item.prices, selectedCurrency.symbol);
                return (
                  <div key={item.uniqueId} className="flex space-x-3 text-xs">
                    <img src={item.gallery[0]} alt="" className="w-12 h-16 object-cover bg-background" />
                    <div className="flex-1">
                      <p className="font-medium text-primary line-clamp-1">{item.name}</p>
                      <p className="text-secondary text-[11px] mt-0.5">Qty: {item.quantity}</p>
                      <div className="text-[10px] text-secondary/80">
                        {item.userSelectedAttributes.map((a) => `${a.attributeId}: ${a.attributeValue}`).join(' • ')}
                      </div>
                    </div>
                    <span className="font-medium text-primary">
                      {formatPrice(itemPrice * item.quantity, selectedCurrency.symbol)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, selectedCurrency.symbol)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Estimated VAT (21%)</span>
                <span>{formatPrice(taxes, selectedCurrency.symbol)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Shipping</span>
                <span className="text-olive-light">Complimentary</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-primary">
                <span>Total Due</span>
                <span>{formatPrice(grandTotal, selectedCurrency.symbol)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
