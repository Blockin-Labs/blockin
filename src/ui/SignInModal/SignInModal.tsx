// Generated with util/create-component.js
import React, { ReactNode, useEffect, useState } from 'react';
import '../../index.css';
import '../../output.css';
import { AssetConditionGroup, ChallengeParams, NumberType } from '../../types/verify.types';
import { createChallenge, generateAssetConditionGroupString } from '../../verify';
import { Spinner } from '../SignInWithBitBadges/SignInWithBitBadges';
import { getChain } from '../SupportedChains';
import './SignInModal.scss';
import { AccessTier, SignInModalProps } from './SignInModal.types';

/*
 * Gets the default selected resources from the passed-in props
 * @param resources Resources passed in as props
 * @returns Array of formatted string[] resources
 */
const getDefaultSelectedResources = (assets: AccessTier<NumberType>[]) => {
  const selectedAssets: string[] = [];
  for (const asset of assets) {
    if (asset.defaultSelected) {
      selectedAssets.push(`${asset.name}`);
    }
  }

  return {
    selectedAssets
  };
};

const LinkComponent = ({ url, text }: { url: string; text?: string }) => {
  return (
    <a className="blockin-link" href={url} target="_blank" rel="noreferrer">
      {text ? text : url}
    </a>
  );
};

/**
 * BlockinUIDisplay - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const SignInModal: React.FC<SignInModalProps<NumberType>> = ({
  challengeParams,
  address,
  accessTiers,
  signAndVerifyChallenge,
  selectedChainName,
  selectedChainInfo,
  modalStyle,
  displayNotConnnectedWarning = true,
  modalIsVisible,
  setModalIsVisible,
  allowTimeSelect = false,
  maxTimeInFuture,
  preSignature = false,
  customBeforeSigningWarning,
  nonWalletSignIn = false
}) => {
  accessTiers = accessTiers ?? [];

  const [displayMessage, setDisplayMessage] = useState('');
  const [chain, setChain] = useState(getChain(selectedChainName, selectedChainInfo));
  const [loading, setLoading] = useState('');

  const [advancedIsVisible, setAdvancedIsVisible] = useState(false);

  const [currSiteOrigin, setCurrSiteOrigin] = useState('');

  const trustedDomains = ['http://localhost:3000', 'https://bitbadges.io'];
  const domainDifferentFromOrigin = !challengeParams?.domain || challengeParams.domain !== currSiteOrigin;
  const onTrustedOrigin = !domainDifferentFromOrigin || trustedDomains.includes(challengeParams?.domain ?? '');

  useEffect(() => {
    setCurrSiteOrigin(window.location.origin);
  }, []);

  const [hours, setHours] = useState(24);

  const [selectedAssets, setSelectedAssets] = useState<string[]>(getDefaultSelectedResources(accessTiers).selectedAssets);

  useEffect(() => {
    const res = getDefaultSelectedResources(accessTiers);
    setSelectedAssets(res.selectedAssets);
    setDisplayMessage('');
  }, [accessTiers.length]);

  /**
   * This will be true when 1) there are no selectable resources passed in by provider and 2) user can not add custom
   * resources.
   */
  const resourcesAreHidden = accessTiers.length === 0;

  /**
   * Upon chain change, update chain metadata and props
   */
  useEffect(() => {
    const chainInfo = getChain(selectedChainName, selectedChainInfo);
    setChain(chainInfo);

    setLoading('');
    setDisplayMessage('');
  }, [selectedChainName, address]);

  const challengeParamsAreValid =
    challengeParams && challengeParams.address && challengeParams.domain && challengeParams.statement && challengeParams.uri && challengeParams.nonce;

  /**
   * Handles a user clicking the sign in button on the popup modal.
   */
  const handleSignIn = async () => {
    if (!signAndVerifyChallenge) {
      setDisplayMessage(
        'signAndVerifyChallenge needs to be defined for signing in. If you did not want to include sign-in functionality, set hideLogin to true.'
      );
      throw 'signAndVerifyChallenge needs to be defined for signing in. If you did not want to include sign-in functionality, set hideLogin to true.';
    }

    if (!challengeParamsAreValid) {
      setDisplayMessage('challengeParams are invalid.');
      throw 'challengeParams are invalid.';
    }

    setLoading('Creating challenge...');
    setDisplayMessage('');

    const assetsToVerify: AccessTier<NumberType>[] = selectedAssets.map(
      (asset) => accessTiers.find((elem) => `${elem.name}` === asset) as AccessTier<NumberType>
    );
    if (assetsToVerify.some((x) => !x)) {
      setDisplayMessage('Error: Assets not found.');
      setLoading('');
      return;
    }

    const assetConditionGroups = assetsToVerify.map((x) => x.assetConditionGroup).filter((x) => x) as AssetConditionGroup<NumberType>[];

    /**
     * Generate the challenge object by and input the selectedUris
     */
    const challenge: ChallengeParams<NumberType> = {
      ...challengeParams,
      resources:
        (assetsToVerify
          .map((x) => x.resourcesToAdd)
          .filter((x) => x)
          .flat() as string[]) ?? [],
      assetOwnershipRequirements: assetConditionGroups.length > 1 ? { $and: assetConditionGroups } : assetConditionGroups[0],
      expirationDate: allowTimeSelect ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString() : challengeParams.expirationDate
    };

    try {
      /**
       * Call Blockin to create the challenge string.
       */
      const challengeString = createChallenge(challenge, selectedChainName);

      setLoading('Awaiting signature and verification...');
      /**
       * Sign and verify the challenge using the passed in signAndVerifyChallenge() props function.
       *
       * Expects { success: boolean, message: string }
       */
      const { success, message } = await signAndVerifyChallenge(challengeString);

      setLoading('');
      /**
       * Handle success / failure
       */
      if (!success) {
        setDisplayMessage(message);
        setLoading('');
      } else {
        setDisplayMessage('');
        setSelectedAssets(getDefaultSelectedResources(accessTiers).selectedAssets);
        setModalIsVisible(false);
        setLoading('');
      }
    } catch (e) {
      console.log(e);
      setLoading('');
      setDisplayMessage(e.message);
    }
  };

  const generateHumanReadableTimeDetails = (notBefore?: string, expirationDate?: string) => {
    if (!notBefore && !expirationDate) {
      return 'This sign-in will always be valid (no expiration date).';
    } else if (notBefore && !expirationDate) {
      return `This sign-in will have no expiration date but will not be valid until ${new Date(notBefore).toLocaleString()}.`;
    } else if (!notBefore && expirationDate) {
      return `This sign-in will expire at ${new Date(expirationDate).toLocaleString()}.`;
    } else if (notBefore && expirationDate) {
      return `This sign-in will expire at ${new Date(expirationDate).toLocaleString()} and will not be valid until ${new Date(
        notBefore
      ).toLocaleString()}.`;
    } else {
      throw 'Error: Invalid time details.';
    }
  };

  return (
    <div className="blockin-global">
      {/* Popup Modal Once Clicked */}
      {modalIsVisible && (
        <>
          <div
            className="blockin-root w-full"
            onClick={(e) => {
              if (!(e.target as any).closest('.blockin-popup-container')) {
                //HACK: TS Hack
                setModalIsVisible(false); // Close the modal
                setDisplayMessage('');
                setSelectedAssets(getDefaultSelectedResources(accessTiers).selectedAssets);
              }
              // setModalIsVisible(!modalIsVisible);
              // e.stopPropagation();
              // e.preventDefault();
            }}>
            <div
              className="blockin-popup-container modal-style-override rounded-xl inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#10244d_100%)]"
              style={modalStyle}
              onClick={(e) => {
                // e.stopPropagation();
                // e.preventDefault();
              }}>
              <div className="blockin-popup modal-style-override" style={modalStyle}>
                {displayNotConnnectedWarning && (
                  <>
                    <div className="flex-center">
                      <b
                        style={{
                          color: 'orange',
                          textAlign: 'center'
                        }}>
                        Warning: Your wallet is not currently connected.
                      </b>
                    </div>

                    <br />
                  </>
                )}
                {/* Header with the Close Button */}
                <div className="blockin-header flex items-center py-2 flex-center">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noreferrer" className="blockin-link">
                        <img src="https://github.com/Blockin-Labs/blockin/blob/main/images/blockin.png?raw=true" alt="Blockin" className="h-10" />
                      </a>
                    </div>
                    <div className="mr-4">
                      <img src={chain.logo} alt={chain.name} className="h-10" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-xl font-bold">Sign In with {chain.name}</h2>
                    </div>
                  </div>
                </div>

                {/* Challenge Details */}
                <div className="blockin-challenge">
                  <br />
                  {challengeParamsAreValid ? (
                    <>
                      <div className="blockin-challenge-details">
                        {challengeParams.uri !== challengeParams.domain && (
                          <>
                            <p className="my-2">
                              <b>
                                <LinkComponent url={challengeParams.uri} />
                              </b>
                            </p>
                          </>
                        )}
                        <p className="my-2">
                          <b>
                            <LinkComponent url={challengeParams.domain} /> wants you to sign in with your {chain.name} account:{' '}
                            {
                              <LinkComponent
                                text={challengeParams.address}
                                url={chain.getAddressExplorerUrl ? chain.getAddressExplorerUrl(challengeParams.address) : ''}
                              />
                            }
                          </b>
                        </p>
                        <p className="my-2">
                          <b>{challengeParams.statement}</b>
                        </p>
                        {challengeParams.issuedAt && (
                          <>
                            <p className="my-2">
                              <b>This sign-in request was issued at {new Date(challengeParams.issuedAt).toLocaleString()}</b>
                            </p>
                          </>
                        )}

                        {allowTimeSelect ? (
                          <>
                            <div
                              className="flex"
                              style={{
                                alignItems: 'center',
                                marginTop: 4
                              }}>
                              <b>
                                Remember my sign-in for
                                <input
                                  type="number"
                                  value={hours}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value) setHours(Number(value));
                                  }}
                                  min={1}
                                  max={maxTimeInFuture ? maxTimeInFuture / (1000 * 60 * 60) : undefined}
                                  className="h-6 w-12 px-2 py-1 m-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
                                />
                                hours
                              </b>
                            </div>
                          </>
                        ) : (
                          <p className="my-2">
                            <b>{generateHumanReadableTimeDetails(challengeParams.notBefore, challengeParams.expirationDate)}</b>
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <b>Error: Challenge parameters are invalid.</b>
                      </p>
                    </>
                  )}
                </div>

                {/* Challenge Resources Preset According to Props */}
                <div className="blockin-preset-resources">
                  {!resourcesAreHidden && (
                    <>
                      {accessTiers.length !== 0 && accessTiers.some((x) => x.assetConditionGroup) && (
                        <>
                          <br />
                          {accessTiers.map((elem) => {
                            if (!elem.assetConditionGroup) return null;

                            const ownershipString = generateAssetConditionGroupString(elem.assetConditionGroup, 0, 1, '');

                            const lines = ownershipString.split('\n');
                            let currChain = 'Ethereum';
                            let currCollectionId: string | NumberType = '';
                            const convertedLines: ReactNode[] = [];
                            const chains: string[] = [];

                            for (const line of lines) {
                              const trimmedLine = line.trim();

                              if (trimmedLine.startsWith('Chain')) {
                                currChain = trimmedLine.split(': ')[1].trim();
                                chains.push(currChain);
                                continue;
                              } else if (trimmedLine.startsWith('Asset IDs')) {
                                const chain = getChain(currChain, selectedChainInfo);
                                const ids = trimmedLine.split(': ')[1].trim();
                                const [start, end] = ids
                                  .split(' to ')
                                  .map((x) => x.trim())
                                  .map((x) => BigInt(x));
                                if (start === end) {
                                  const Link = (
                                    <LinkComponent
                                      url={chain.getTokenExplorerUrl ? chain.getTokenExplorerUrl(currCollectionId.toString(), start.toString()) : ''}
                                      text={start.toString()}
                                    />
                                  );
                                  convertedLines.push(
                                    <>
                                      {line.split(': ')[0]}: {Link}
                                    </>
                                  );
                                } else {
                                  convertedLines.push(line);
                                }
                              } else if (trimmedLine.startsWith('Asset ID')) {
                                //string or a number
                                const chain = getChain(currChain, selectedChainInfo);
                                const assetId = trimmedLine.split(': ')[1].trim();
                                const Link = (
                                  <LinkComponent
                                    url={chain.getTokenExplorerUrl ? chain.getTokenExplorerUrl(currCollectionId.toString(), assetId.toString()) : ''}
                                    text={assetId.toString()}
                                  />
                                );
                                convertedLines.push(
                                  <>
                                    {line.split(': ')[0]}: {Link}
                                  </>
                                );
                              } else if (trimmedLine.startsWith('Ownership Times')) {
                                const ownershipTimes = trimmedLine.split(': ')[1].trim();
                                const timeRange = ownershipTimes.split('to');
                                if (timeRange.length == 1) {
                                  console.log(ownershipTimes);
                                  const dateString = ownershipTimes.split(' onwards')[0];
                                  console.log(dateString);
                                  //onwards
                                  convertedLines.push(
                                    <>
                                      {line.split(': ')[0]}: {new Date(dateString).toLocaleString()} onwards
                                    </>
                                  );
                                } else {
                                  //date range
                                  convertedLines.push(
                                    <>
                                      {line.split(': ')[0]}: {new Date(timeRange[0].trim()).toLocaleString()} to{' '}
                                      {new Date(timeRange[1].trim()).toLocaleString()}
                                    </>
                                  );
                                }
                              } else if (trimmedLine.startsWith('Ownership Time')) {
                                //date string or "Authentication Time"
                                const time = trimmedLine.split(': ')[1].trim();
                                if (time === 'Authentication Time') {
                                  convertedLines.push(line);
                                } else {
                                  convertedLines.push(
                                    <>
                                      {line.split(': ')[0]}: {new Date(Number(BigInt(time))).toLocaleString()}
                                    </>
                                  );
                                }
                              } else if (trimmedLine.startsWith('Collection ID')) {
                                //uint or string
                                currCollectionId = trimmedLine.split(': ')[1].trim();
                                const chain = getChain(currChain, selectedChainInfo);

                                const link = (
                                  <LinkComponent
                                    url={chain.getCollectionExplorerUrl ? chain.getCollectionExplorerUrl(currCollectionId.toString()) : ''}
                                    text={chain.name + ' Collection: ' + currCollectionId.toString()}
                                  />
                                );
                                convertedLines.push(
                                  <>
                                    {line.split('Collection ID: ')[0]}
                                    {/* <img src={chain.logo} height='20px' width='auto' style={{ height: 20, width: 'auto', marginLeft: 4, marginRight: 4 }} /> */}

                                    {link}
                                  </>
                                );
                              } else {
                                convertedLines.push(line);
                              }
                            }

                            return (
                              <>
                                <div
                                  className="blockin-listitem"
                                  style={{
                                    alignItems: 'normal'
                                  }}>
                                  {/* Metadata includes 1) chain logo, 2) asset name, 3) LinkComponent to asset, and 
                                            4) desccription of asset
                                         */}
                                  <div
                                    className="blockin-listitem-metadata"
                                    style={{
                                      alignItems: 'normal'
                                    }}>
                                    <div
                                      style={{
                                        width: '100%'
                                      }}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          flexWrap: 'wrap'
                                        }}>
                                        <div
                                          style={{
                                            display: 'flex'
                                          }}>
                                          {elem.image && (
                                            <div
                                              style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'normal'
                                              }}>
                                              <div className="blockin-listitem-logo">
                                                <img
                                                  src={elem.image}
                                                  height="51px"
                                                  width="auto"
                                                  style={{
                                                    height: 51,
                                                    width: 'auto'
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          <div
                                            style={{
                                              marginTop: 16
                                            }}>
                                            <b
                                              style={{
                                                fontSize: 22
                                              }}>
                                              {elem.name}
                                            </b>
                                          </div>
                                        </div>
                                        {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                            fields to allow / disable selecting. */}
                                        <div
                                          className="blockin-listitem-button"
                                          style={{
                                            alignItems: 'normal'
                                          }}>
                                          <input
                                            type="checkbox"
                                            className={`form-checkbox rounded h-8 w-8 ${
                                              selectedAssets.includes(elem.name) ? 'text-indigo-600' : 'text-gray-400'
                                            } ${
                                              elem.frozen
                                                ? 'cursor-not-allowed'
                                                : selectedAssets.includes(elem.name)
                                                ? 'cursor-pointer'
                                                : 'cursor-pointer'
                                            }`}
                                            checked={selectedAssets.includes(elem.name)}
                                            disabled={elem.frozen}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              if (isChecked) {
                                                setSelectedAssets([...selectedAssets, elem.name]);
                                              } else {
                                                const newArr = selectedAssets.filter((asset) => asset !== elem.name);
                                                setSelectedAssets(newArr);
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <br /> {elem.description}
                                      <br />
                                      <br />
                                      <b>Ownership Requirements</b>
                                      <div style={{ fontSize: 12 }}>
                                        {convertedLines.map((line) => {
                                          //keep indentation

                                          return (
                                            <>
                                              <div
                                                style={{
                                                  whiteSpace: 'pre-wrap'
                                                }}>
                                                {line}
                                                <br />
                                              </div>
                                            </>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {elem.additionalDisplay ? <>{elem.additionalDisplay}</> : <></>}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Final Sign Challenge Button. Calls signChallenge() and verifyChallenge(). */}

                <div className="blockin-sign-challenge-button mt-12" style={{ fontSize: 12, color: 'grey' }}>
                  {/* <br /> */}
                  {/* Loading Spinner */}
                  {loading ? (
                    <>
                      {' '}
                      <div className="flex-center flex-column">
                        <b>{loading}</b>
                        <br />
                        <br />
                        <Spinner />
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {displayMessage && (
                    <b style={{ color: 'red' }}>
                      <p>Oops! We ran into an error.</p>
                      <p>Error message: {displayMessage}</p>
                    </b>
                  )}
                  <br />
                  <div className="flex-center mb-4">
                    <button className="blockin-button" onClick={handleSignIn} disabled={loading ? true : false}>
                      {preSignature ? 'Sign' : 'Sign In'}
                    </button>
                  </div>
                  {/* <br /> */}
                  {!nonWalletSignIn && (
                    <p>
                      Upon clicking the button below, this site will send a signature request to your connected {chain.name} wallet. This is a simple
                      message signature. It is not a transaction and is free of charge. The signature of this message is your secret authentication
                      code.
                    </p>
                  )}
                  <p>
                    <div className="">
                      <span style={{ color: 'orange', fontSize: 15 }}>{'\u26A0'}</span> Only proceed to sign this message if all of the information
                      above is correct and you trust the site you are currently on ({currSiteOrigin}).
                      {!onTrustedOrigin && (
                        <span style={{ color: 'orange' }}>
                          {' '}
                          Note that the site you are currently on is different from the site to be authenticated on. This site ({currSiteOrigin}) will
                          be able to see your secret authentication code.
                        </span>
                      )}
                      {customBeforeSigningWarning && <span style={{ color: 'orange' }}> {customBeforeSigningWarning}</span>}
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignInModal;
