// pages/index.js
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [view, setView] = useState('container');
  const [multiplier, setMultiplier] = useState(1.00);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const getSignal = useCallback(() => {
    setView('loading');
    setShowSubscribe(false);
    setShowLoading(false);
    setMultiplier(1.00);

    let currentMultiplier = 1.00;
    const interval = setInterval(() => {
      currentMultiplier += 0.01;
      setMultiplier(parseFloat(currentMultiplier.toFixed(2)));

      if (currentMultiplier >= 1.30) {
        clearInterval(interval);
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
          setMultiplier(1.00);
          setShowSubscribe(true);
        }, 4000);
      }
    }, 20);
  }, []);

  const showPlans = useCallback(() => {
    setView('plans');
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }, []);

  const goBack = useCallback(() => {
    setView('container');
    setShowSubscribe(false);
    setShowLoading(false);
    setMultiplier(1.00);
    setShowPaymentError(false);
  }, []);

  const confirmPayment = useCallback(() => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setShowPaymentError(true);
      setTimeout(() => {
        setShowPaymentError(false);
        goBack();
      }, 3000);
    }, 3000);
  }, [goBack]);

  const selectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
    setPaymentAmount(plan === 'weekly' ? 5 : 20);
    setView('payment');
    setTimeLeft(120);
  }, []);

  const renderContainer = () => (
    <div className={styles.content}>
      <h1>
        <span>Hack Prediction</span>
        <span className={styles.botText}>Bot</span>
      </h1>
      <Image src="/lucky.jpg" alt="Lucky Jet" width={300} height={200} className={styles.imagePlac} />
      <p className={styles.info}>Get your lucky signals and subscribe for more information!</p>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={getSignal}>Get Signal</button>
        <button className={styles.button} onClick={showPlans}>Subscribe</button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className={styles.loading}>
      <h2 className={styles.letsHack}>Let's Hack</h2>
      <div className={styles.multiplierCircle}>
        {showLoading ? (
          <span className={styles.loadingText}>Loading<span className={styles.dots}>...</span></span>
        ) : (
          <span className={multiplier === 1.00 && showSubscribe ? styles.redMultiplier : ''}>
            x{multiplier.toFixed(2)}
          </span>
        )}
      </div>
      {showSubscribe && (
        <>
          <p className={styles.subscribeText}>
            Get a subscribe
            <span className={styles.dots}>...</span>
          </p>
          <button className={styles.backButton} onClick={goBack}>Back to Menu</button>
        </>
      )}
    </div>
  );

  const renderPlans = () => (
    <div className={styles.plans}>
      <h2>Select a Plan</h2>
      <div className={styles.plan} onClick={() => selectPlan('weekly')}>
        <h3>Weekly Plan for $5</h3>
        <p>Get access to premium signals for one week</p>
      </div>
      <div className={styles.plan} onClick={() => selectPlan('monthly')}>
        <h3>Monthly Plan for $20</h3>
        <p>Get access to premium signals for one month</p>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className={styles.paymentInfo}>
      {showLoading ? (
        <div className={styles.loadingOverlay}>
          <span className={styles.loadingText}>Loading<span className={styles.dots}>...</span></span>
        </div>
      ) : showPaymentError ? (
        <div className={styles.errorOverlay}>
          <p className={styles.errorText}>You did not make the payment! Please try again.</p>
        </div>
      ) : (
        <>
          <h1 className={styles.paymentTitle}>Payment Information</h1>
          <p>Please send the payment to the following USDT (<span className={styles.trc20}>TRC20</span>) address:</p>
          <div className={styles.cryptoAddress} onClick={() => copyToClipboard('TPforvRe4vhsbMiRsoCTzXGgmMvXxoGph6')}>
            TPforvRe4vhsbMiRsoCTzXGgmMvXxoGph6
            <span className={styles.copyIcon}>📋</span>
          </div>
          <p>Time left to complete the payment:</p>
          <div className={styles.timer}>
            {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
          </div>
          <p>Please send ${paymentAmount} worth of USDT (<span className={styles.trc20}>TRC20</span>) to the address above within 2 minutes.</p>
          <button className={styles.confirmButton} onClick={confirmPayment}>Confirm Payment</button>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Lucky Jet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {view === 'container' && renderContainer()}
        {view === 'loading' && renderLoading()}
        {view === 'plans' && renderPlans()}
        {view === 'payment' && renderPayment()}
      </main>
    </div>
  );
}
