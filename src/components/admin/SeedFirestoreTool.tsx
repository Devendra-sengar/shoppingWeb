import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore/lite';
import { db } from '../../services/firebase/firebase';
import { MOCK_PRODUCTS, DEFAULT_CURRENCIES } from '../../data/mockProducts';
import { Database, UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const SeedFirestoreTool: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSeed = async () => {
    if (!db) {
      setStatus('error');
      setErrorMessage('Firebase is not initialized. Please verify your .env credentials.');
      return;
    }

    try {
      setStatus('uploading');
      setProgress('Initializing upload to Firestore...');

      // 1. Upload Currencies
      setProgress('1/2 Uploading Currencies collection (INR, USD, EUR, GBP, JPY)...');
      const currenciesCol = collection(db, 'currencies');
      for (const cur of DEFAULT_CURRENCIES) {
        await setDoc(doc(currenciesCol, cur.label), cur);
      }

      // 2. Upload Products
      setProgress(`2/2 Uploading ${MOCK_PRODUCTS.length} fashion garments to 'products' collection...`);
      const productsCol = collection(db, 'products');
      let count = 0;
      for (const prod of MOCK_PRODUCTS) {
        count++;
        setProgress(`Uploading garment ${count} of ${MOCK_PRODUCTS.length}: "${prod.name}"...`);
        await setDoc(doc(productsCol, prod.id), prod);
      }

      setStatus('success');
      setProgress(`All ${MOCK_PRODUCTS.length} products & 5 currencies successfully seeded to Firestore!`);
    } catch (err: any) {
      console.error('Seeding error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Firestore write permission denied. Check your Firestore Security Rules.');
    }
  };

  return (
    <div className="bg-stone-900 text-white p-6 rounded-lg border border-stone-800 shadow-md space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-medium text-stone-100">Firestore Cloud Database Sync</h3>
          <p className="text-xs text-stone-400">
            One-click sync to populate your Firebase Firestore <code className="text-amber-300">products</code> and <code className="text-amber-300">currencies</code> collections.
          </p>
        </div>
      </div>

      {status === 'idle' && (
        <button
          onClick={handleSeed}
          className="inline-flex items-center space-x-2 bg-[#5B6955] hover:bg-[#4a5745] text-white px-4 py-2 rounded text-xs uppercase tracking-luxury font-medium transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload {MOCK_PRODUCTS.length} Products to Firestore</span>
        </button>
      )}

      {status === 'uploading' && (
        <div className="flex items-center space-x-3 text-xs text-amber-300 bg-amber-950/40 p-3 rounded border border-amber-900/50">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{progress}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded border border-emerald-900/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{progress}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-stone-300 hover:text-white underline"
          >
            Refresh page to fetch live data from Firestore →
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <div className="flex items-start space-x-2 text-xs text-red-400 bg-red-950/40 p-3 rounded border border-red-900/50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sync Failed:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            💡 If the error is <strong className="text-stone-300">"Missing or insufficient permissions"</strong>, go to your Firebase Console → <strong>Firestore Database → Rules</strong> and change to:
            <code className="block bg-black/60 p-2 rounded mt-1 font-mono text-[10px] text-amber-200">
              allow read, write: if true;
            </code>
          </p>
          <button
            onClick={handleSeed}
            className="mt-2 text-xs bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded"
          >
            Retry Upload
          </button>
        </div>
      )}
    </div>
  );
};
