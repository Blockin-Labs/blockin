import React, { useEffect, useMemo, useState } from 'react';
import { ChallengeParams, NumberType, VerifyChallengeOptions } from '../../types/verify.types';
import { verifyChallenge } from '../../verify';

const FRONTEND_URL = 'https://bitbadges.io';


export const SignInWithBitBadgesButton: React.FC<{
  noDefaultStyles?: boolean;
  darkMode?: boolean;
  children?: React.ReactNode;
  popupParams: {
    name: string;
    description: string;
    image: string;

    //The challenge message parameters to be signed by the user
    challengeParams: ChallengeParams<NumberType>;
    //Whether to allow address selection or not
    allowAddressSelect: boolean;
    //Options to pass into verifyChallenge
    verifyOptions?: VerifyChallengeOptions;
    //Whether to skip the Blockin verification step or not
    skipVerify?: boolean;
    //Whether or not to expect signature verification to be successful
    expectVerifySuccess?: boolean;

    //Discord OAuth2 parameters
    discord?: {
      clientId: string;
      redirectUri: string;
    };

    //Whether to expect secrets proofs to be provided
    expectSecretsProofs?: boolean;
    //Whether to only expect proofs to be provided
    onlyProofs?: boolean;
  };
  props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

  /**
   * onSignAndBlockinVerify is a callback function that is returned upon user signature and Blockin verification.
   * The Blockin verification response may or may not succeed, so it is important for you to check the response (if applicable).
   *
   * If it does succeed, you know that the following is true:
   * - The user signed the message correctly
   * - The message is well-formed
   * - The message was signed by the user's address
   * - User meets the requirements for any assets specified in the message (badges owned, etc)
   *
   * You can generate the challenge params object from the message string using the following code:
   * import { constructChallengeObjectFromString } from 'blockin';
   * const params = constructChallengeObjectFromString(message, BigIntify);
   *
   * Once you have the params object, you can use it to verify the message on your backend.
   *
   * @param message The message that was signed by the user
   * @param signature The signature of the message
   * @param verification The verification response from Blockin
   */
  onSignAndBlockinVerify: (message: string, signature: string, verification: { success: boolean; errorMessage?: string }) => Promise<void>;
}> = ({ popupParams, onSignAndBlockinVerify, props, children, noDefaultStyles }) => {
  const [loading, setLoading] = useState(false);

  const url = useMemo(() => {
    let url = FRONTEND_URL + '/auth/codegen?';
    for (const [key, value] of Object.entries({
      ...popupParams,
      callbackRequired: true,
      storeInAccount: false
    })) {
      if (value) {
        if (typeof value === 'object') {
          const valueString = JSON.stringify(value);
          const encodedValue = encodeURIComponent(valueString);
          url = url.concat(`${key}=${encodedValue}&`);
        } else {
          url = url.concat(`${key}=${value}&`);
        }
      }
    }
    return url;
  }, [popupParams]);

  const openChildWindow = () => {
    // Opens a new window with the specified URL as a fullscreen popup.
    const openedWindow = window.open(url, '_blank', 'width=500,height=800,scrollbars=yes,resizable=yes');

    // You can further customize the child window as needed
    openedWindow?.focus();

    //set listener for when the child window closes
    const timer = setInterval(() => {
      if (openedWindow?.closed) {
        clearInterval(timer);
        setLoading(false);
      }
    }, 1000);
  };

  //https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  const handleChildWindowMessage = async (event: MessageEvent) => {
    if (event.origin === FRONTEND_URL) {
      if (!event.source) {
        throw new Error('Event source is null');
      }

      if (!event.data.message || !event.data.signature || !event.data.verificationResponse) {
        //To avoid the listening to self events if we are actually on bitbadges.io and just an overall quality check
        return;
      }

      // Check if the message contains a signature field
      if (event.data.signature) {
        if (typeof event.data.signature !== 'string') {
          throw new Error('Signature must be a string');
        }
      }

      // Handle the message
      if (event.data.message) {
        if (typeof event.data.message !== 'string') {
          throw new Error('Message must be a string');
        }
      }

      if (event.data.verificationResponse) {
        if (typeof event.data.verificationResponse !== 'object') {
          throw new Error('Verification response must be an object');
        }
        if (typeof event.data.verificationResponse.success !== 'boolean') {
          throw new Error('Verification response must contain a boolean success field');
        }
        if (event.data.verificationResponse.errorMessage && typeof event.data.verificationResponse.errorMessage !== 'string') {
          throw new Error('Verification response error message must be a string');
        }
      }

      // Having verified identity, however, you still should always verify the syntax of the received message. Check if the message is well-formed.
      // Even though we know the message came from BitBadges, we still need to verify that the message is well-formed according to our desired URL format.
      // This is because the message could have been tampered with by the user or a malicious actor.
      // This also filters out any potential messages that are not meant for your application, such as from other BitBadges tabs open.
      //
      // We assume that the if the message is correct and as intended, the (message, signature, verificationResponse) pair will be correctly provided by BitBadges.
      let clientSideVerificationResponse = { success: true, errorMessage: '' };
      try {
        await verifyChallenge(undefined, event.data.message, event.data.signature, {
          ...popupParams.verifyOptions,

          skipAssetVerification: true,
          skipSignatureVerification: true
        });
      } catch (e) {
        clientSideVerificationResponse = { success: false, errorMessage: e.errorMessage ?? e.message };
      }

      if (onSignAndBlockinVerify) {
        await onSignAndBlockinVerify(
          event.data.message,
          event.data.signature,
          event.data.verificationResponse.success ? clientSideVerificationResponse : event.data.verificationResponse
        );
      }

      setLoading(false);
    }
  };

  // Add a listener to handle messages from the child window
  useEffect(() => {
    window.addEventListener('message', handleChildWindowMessage);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleChildWindowMessage);
    };
  }, []);

  const buttonStyle = noDefaultStyles
    ? {}
    : {
        width: 250,
        backgroundColor: 'black',
        fontSize: 14,
        fontWeight: 600,
        color: 'white'
      };

  const defaultClassName = noDefaultStyles ? '' : 'blockin-button';

  return (
    <button
      {...props}
      style={{
        ...buttonStyle,
        ...(props?.style ?? {})
      }}
      className={`${defaultClassName} ${props?.className ?? ''}`}
      disabled={props?.disabled || loading}
      onClick={() => {
        props?.onClick?.(null as any);
        setLoading(true);
        openChildWindow();
      }}>
      {children ?? (
        <div className="flex-center flex-wrap">
          Sign In with <img src="https://bitbadges.io/images/bitbadgeslogotext.png" style={{ height: 20, marginLeft: 5 }} alt="BitBadges" />{' '}
          {loading && <Spinner />}
        </div>
      )}
    </button>
  );
};

export const Spinner: React.FC<{}> = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline ml-3 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SignInWithBitBadgesButton;
