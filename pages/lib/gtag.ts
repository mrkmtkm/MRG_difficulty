// lib/gtag.ts
export const ga_id = process.env.NEXT_PUBLIC_GA_ID || '';

// PV 測定
 export const pageview = (url: string): void => {
  // GA_TRACKING_ID が設定されていない場合は、処理終了
  if (!ga_id) return;
  window.gtag('config', ga_id, {
    page_path: url,
  });
};