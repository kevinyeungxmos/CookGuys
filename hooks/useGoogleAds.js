/*
import { useEffect, useState } from "react"
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";

const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});


export const useGoogleAds = () => {
  
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoaded(true);
      });
  
      // Start loading the interstitial straight away
      interstitial.load();
      // Unsubscribe from events on unmount
      return unsubscribe;
    }, []);
  
    useEffect(() => {
      if (loaded) {
        interstitial.show();
      }
    }, [loaded])

    return loaded
    
}
*/

export const useGoogleAds = () => {}