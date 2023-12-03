// Generated with util/create-component.js
import { Col, InputNumber, Spin, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { createChallenge } from "../../verify";
import { getChain } from '../SupportedChains';
import { PresetAsset, PresetUri, SignInModalProps } from "./SignInModal.types";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./SignInModal.scss";
import { NumberType } from "../../types/verify.types";

/*
 * Gets the default selected resources from the passed-in props
 * @param resources Resources passed in as props
 * @returns Array of formatted string[] resources
 */
const getDefaultSelectedResources = (resources: PresetUri[], assets: PresetAsset<NumberType>[]) => {
  const selectedUris: string[] = [];
  const selectedAssets: string[] = [];
  for (const resource of resources) {
    if (resource.defaultSelected) {
      selectedUris.push(`${resource.uri}`)
    }
  }

  for (const asset of assets) {
    if (asset.defaultSelected) {
      selectedAssets.push(`${asset.name}`)
    }
  }

  return {
    selectedUris,
    selectedAssets
  }
}


const LinkComponent = ({ url, text }: { url: string, text?: string }) => {
  return <a className='blockin-link' href={url} target='_blank' rel="noreferrer">{text ? text : url}</a>
}

/**
 * BlockinUIDisplay - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
const BlockinUIDisplay: React.FC<SignInModalProps<NumberType>> = ({
  challengeParams,
  address,
  displayedResources = [],
  displayedAssets = [],
  signAndVerifyChallenge,
  selectedChainName,
  selectedChainInfo,
  modalStyle,
  displayNotConnnectedWarning = true,
  modalIsVisible,
  setModalIsVisible,
  allowTimeSelect = false,
  maxTimeInFuture,
  preSignature = false
}) => {
  const [selectedUris, setSelectedUris] = useState<string[]>(getDefaultSelectedResources(displayedResources, displayedAssets).selectedUris);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(getDefaultSelectedResources(displayedResources, displayedAssets).selectedAssets);
  const [displayMessage, setDisplayMessage] = useState('');
  const [chain, setChain] = useState(getChain(selectedChainName, selectedChainInfo));
  const [assetId, setAssetId] = useState('');
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState('');

  const [advancedIsVisible, setAdvancedIsVisible] = useState(false);

  const [hours, setHours] = useState(24);

  /**
   * This will be true when 1) there are no selectable resources passed in by provider and 2) user can not add custom
   * resources.
   */
  const resourcesAreHidden = displayedAssets.length === 0 && displayedResources.length === 0;

  /**
   * Adds a resource that was added by the user to selectedUris. Formats in correct Blockin format
   * for assets vs. URIs.
   * @param resource ID / text that the user inputted
   * @param isAssetID If is an asset, we prefix with 'Asset ID: ' to match the Blockin interface 
   */
  const addCustomResource = async (resource: string, isAssetID?: boolean) => {
    if (!resource) return;
    const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource
    const newArr = [...selectedUris, resourceToAdd]
    setSelectedUris(newArr);
  }

  /**
   * Upon chain change, update chain metadata and props
   */
  useEffect(() => {
    const chainInfo = getChain(selectedChainName, selectedChainInfo);
    setChain(chainInfo);

    setLoading('');
    setDisplayMessage('');
  }, [
    selectedChainName,
    address
  ]);

  const challengeParamsAreValid = challengeParams && challengeParams.address && challengeParams.domain && challengeParams.statement && challengeParams.uri && challengeParams.nonce;

  /**
   * Handles a user clicking the sign in button on the popup modal.
   */
  const handleSignIn = async () => {
    if (!signAndVerifyChallenge) {
      setDisplayMessage('signAndVerifyChallenge needs to be defined for signing in. If you did not want to include sign-in functionality, set hideLogin to true.');
      throw 'signAndVerifyChallenge needs to be defined for signing in. If you did not want to include sign-in functionality, set hideLogin to true.'
    }

    if (!challengeParamsAreValid) {
      setDisplayMessage('challengeParams are invalid.');
      throw 'challengeParams are invalid.'
    }

    setLoading('Creating challenge...');
    setDisplayMessage('');

    const assetsToVerify: PresetAsset<NumberType>[] = selectedAssets.map(asset => displayedAssets.find(elem => `${elem.name}` === asset) as PresetAsset<NumberType>);
    /**
     * Generate the challenge object by and input the selectedUris
     */
    const challenge = {
      ...challengeParams,
      resources: selectedUris,
      assets: assetsToVerify,
      expirationDate: allowTimeSelect ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString() : challengeParams.expirationDate
    };


    try {
      /**
       * Call Blockin to create the challenge string.
       */
      const challengeString = await createChallenge(challenge, selectedChainName);

      setLoading('Awaiting signature and verifying...');
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
        setSelectedUris(getDefaultSelectedResources(displayedResources, displayedAssets).selectedUris);
        setSelectedAssets(getDefaultSelectedResources(displayedResources, displayedAssets).selectedAssets);
        setModalIsVisible(false);
        setLoading('');

      }
    } catch (e) {
      console.log(e);
      setLoading('');
      setDisplayMessage(e.message);
    }
  }

  const generateHumanReadableTimeDetails = (notBefore?: string, expirationDate?: string) => {
    if (!notBefore && !expirationDate) {
      return 'This sign-in attempt has no expiration date.';
    }
    else if (notBefore && !expirationDate) {
      return `This sign-in attempt has no expiration date but is not valid until ${notBefore}.`
    }
    else if (!notBefore && expirationDate) {
      return `This sign-in attempt expires at ${expirationDate}.`
    }
    else {
      return `This sign-in attempt expires at ${expirationDate} and is not valid until ${notBefore}.`
    }
  }

  return <div className='blockin-global'>
    {/* Popup Modal Once Clicked */}
    {
      modalIsVisible && <>
        <Col span={24} className='blockin-root' onClick={(e) => {
          if (!(e.target as any).closest('.blockin-popup-container')) { //HACK: TS Hack
            setModalIsVisible(false); // Close the modal
            setDisplayMessage('');
            setSelectedUris(getDefaultSelectedResources(displayedResources, displayedAssets).selectedUris);
            setSelectedAssets(getDefaultSelectedResources(displayedResources, displayedAssets).selectedAssets);
          }
          // setModalIsVisible(!modalIsVisible);
          // e.stopPropagation();
          // e.preventDefault();
        }}>
          <div className="blockin-popup-container modal-style-override" style={modalStyle} onClick={(e) => {
            // e.stopPropagation();
            // e.preventDefault();
          }}>
            <div className="blockin-popup modal-style-override" style={modalStyle}>
              {displayNotConnnectedWarning && <><b>Warning: Your wallet is not currently connected. You will not be able to sign the challenge message.  </b></>}
              {/* Header with the Close Button */}
              <div className='blockin-header'>
                <div className="header-end">

                </div>
                <div className="header-middle">
                  {/* Title and Chain Logo */}

                  <h1>Sign In with Blockin!</h1>
                  <div className='blockin-header-chain-info'>
                    <div>
                      <img src={chain.logo} height='100px' width='auto' style={{ height: 100, width: 'auto' }} />
                      <br />
                      <b style={{ fontSize: 18 }}>{chain.name}</b>
                    </div>
                    <div>
                    </div>
                    <div>

                      <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noreferrer" className="blockin-link">
                        <img src={"https://bafybeibepriagbzr64w6ouvbctaxtixryf5trcubowgz7eihvs5b3dqh6y.ipfs.dweb.link/"} height='100px' width='auto' style={{ height: 100, width: 'auto' }} />
                        <br />
                        <b style={{ fontSize: 18 }}>Blockin</b>
                      </a>
                    </div>
                  </div>


                </div>

                <div className="header-end">

                </div>
              </div>

              {/* Challenge Details */}
              <div className='blockin-challenge'>
                <br /><Typography.Text strong style={{ color: 'inherit', fontSize: 22 }} >Sign-In Details</Typography.Text>
                {challengeParamsAreValid ? <>
                  <div className='blockin-challenge-details'>

                    <p><b>
                      <LinkComponent url={challengeParams.uri} />
                    </b></p>
                    <p><b>
                      <LinkComponent url={challengeParams.domain} /> wants you to sign in with your {chain.name} account: {<LinkComponent text={challengeParams.address} url={chain.getAddressExplorerUrl ? chain.getAddressExplorerUrl(challengeParams.address) : ''} />}
                    </b></p>
                    <p><b>{challengeParams.statement}</b></p>
                    {challengeParams.issuedAt && <><p><b>This sign-in attempt was issued at {challengeParams.issuedAt}</b></p></>}

                    {allowTimeSelect ?
                      <>
                        <div className='flex' style={{ alignItems: 'center', marginTop: 4 }}>
                          <b>
                            Remember my sign-in for
                            <InputNumber

                              value={hours}
                              onChange={(value) => {
                                if (value) setHours(value);
                              }}
                              min={1}
                              max={maxTimeInFuture ? (maxTimeInFuture / (1000 * 60 * 60)) : undefined}
                              style={{ width: 70, marginLeft: 10, marginRight: 10 }}
                            />
                            hours
                          </b>
                        </div>
                      </> : <p><b>{generateHumanReadableTimeDetails(challengeParams.notBefore, challengeParams.expirationDate)}</b></p>}



                    {/* Would probably be nice to have an "Advanced" section here where the user can see all of the below fields which 99% wont understand */}
                    {/* Don't show if undefined */}
                    {/* <br/><Typography.Text strong style={{ color: 'inherit', fontSize: 22}} >Advanced Sign-In Details</Typography.Text><br/> */}
                    <br />
                    <button className="blockin-button-secondary" onClick={() => setAdvancedIsVisible(!advancedIsVisible)}>
                      {advancedIsVisible ? 'Hide' : 'Show Advanced'}
                    </button>
                    {advancedIsVisible && <div style={{ marginTop: 16 }}>
                      <p><b>Nonce: {challengeParams.nonce}</b></p>
                      <p><b>Chain ID: {challengeParams.chainId ? challengeParams.chainId : '1 (Default)'}</b></p>
                      <p><b>Version: {challengeParams.version ? challengeParams.version : '1 (Default)'}</b></p>
                    </div>
                    }
                  </div>
                </> : <><p><b>Error: Challenge parameters are invalid.</b></p></>}
              </div>

              {/* Challenge Resources Preset According to Props */}
              <div className='blockin-preset-resources'>
                {!resourcesAreHidden && <>



                  {(displayedResources.length !== 0 || displayedAssets.length !== 0) && <>

                    <br />
                    <Typography.Text strong style={{ color: 'inherit', fontSize: 22 }} >Select Privileges</Typography.Text>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                      <InfoCircleOutlined rev={''} style={{ marginRight: 4 }} /> Select the privileges you meet the criteria for and would like to receive.
                    </div>
                    <br />
                    <br />

                    {displayedAssets.map(elem => {
                      const chain = getChain(elem.chain);

                      return <>
                        <div className='blockin-listitem' style={{ alignItems: 'normal' }}>
                          {/* Metadata includes 1) chain logo, 2) asset name, 3) LinkComponent to asset, and 
                                            4) desccription of asset
                                         */}
                          <div className='blockin-listitem-metadata' style={{ alignItems: 'normal' }}>

                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'normal' }}>
                                    <div className='blockin-listitem-logo'>
                                      <img src={elem.image ? elem.image : getChain(elem.chain).logo} height='51px' width='auto' style={{ height: 51, width: 'auto' }} />
                                    </div>

                                    {elem.chain === 'BitBadges' &&
                                      <div className='blockin-listitem-logo'>
                                        <img src={getChain('Ethereum').logo} height='17px' width='auto' style={{ height: 17, width: 'auto' }} />
                                        <img src={getChain('Cosmos').logo} height='17px' width='auto' style={{ height: 17, width: 'auto' }} />
                                        <img src={getChain('Solana').logo} height='17px' width='auto' style={{ height: 17, width: 'auto' }} />
                                      </div>}
                                  </div>
                                  <div style={{ marginTop: 16 }}><b style={{ fontSize: 22 }}>{elem.name}</b></div>
                                </div>
                                {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                            fields to allow / disable selecting. */}
                                <div className='blockin-listitem-button' style={{ alignItems: 'normal' }}>
                                  {
                                    <Switch
                                      checkedChildren=""
                                      unCheckedChildren=""
                                      checked={selectedAssets.includes(`${elem.name}`)}
                                      disabled={elem.frozen}
                                      onClick={() => {
                                        const alreadySelected = selectedAssets.includes(`${elem.name}`);
                                        if (!alreadySelected) {
                                          setSelectedAssets([...selectedAssets, `${elem.name}`]);
                                        } else {
                                          const newArr = selectedAssets.filter(resource => resource !== `${elem.name}`)
                                          setSelectedAssets(newArr);
                                        }
                                      }}
                                    />

                                  }
                                </div>
                              </div>
                              <br /> {elem.description}
                              <br />
                              <br />
                              <div style={{ width: '100%' }}>
                                <b>Ownership Requirements</b><br />
                                You must own {[elem.mustOwnAmounts].map(amount => {
                                  if (typeof amount !== 'object') {
                                    return 'x' + BigInt(amount).toString();
                                  } else {
                                    if (amount.start === amount.end) {
                                      return `x${BigInt(amount.start).toString()}`
                                    }
                                    return `x${BigInt(amount.start).toString()}-${BigInt(amount.end).toString()}`
                                  }
                                }).join(', ')} of {elem.assetIds.map((assetId, index) => {
                                  if (typeof assetId !== 'object') {
                                    return <><LinkComponent
                                      url={chain.getTokenExplorerUrl ? chain.getTokenExplorerUrl(elem.collectionId.toString(), assetId.toString()) : ''}
                                      text={"ID: " + assetId.toString()}
                                    />{index !== elem.assetIds.length - 1 ? ', ' : ''}</>
                                  } else {
                                    if (assetId.start === assetId.end) {
                                      return <>ID {BigInt(assetId.start).toString()}{index !== elem.assetIds.length - 1 ? ', ' : ''}</>
                                    }
                                    return <>IDs {BigInt(assetId.start).toString()}-{BigInt(assetId.end).toString()}{index !== elem.assetIds.length - 1 ? ', ' : ''}</>
                                  }
                                })} from <LinkComponent
                                  url={chain.getCollectionExplorerUrl ? chain.getCollectionExplorerUrl(elem.collectionId.toString()) : ''}
                                  text={chain.name + " Collection: " + elem.collectionId.toString()}
                                /> {elem.ownershipTimes ? 'from ' +
                                  elem.ownershipTimes.map(time => {
                                    if (typeof time === 'string') {
                                      return new Date(time).toLocaleString();
                                    } else if (typeof time !== 'object') {
                                      return new Date(Number(BigInt(time))).toLocaleString();
                                    } else {
                                      return `${new Date(Number(BigInt(time.start))).toLocaleString()} until ${new Date(Number(BigInt(time.end))).toLocaleString()}`
                                    }
                                  }).join(', ') : 'at the time of sign-in'} to be approved.
                              </div>
                              {elem.additionalCriteria && <><br /><br /><b>Additional Criteria</b><br />{elem.additionalCriteria}</>}


                              {elem.additionalDisplay ? <>
                                <br />
                                {elem.additionalDisplay}
                              </> : <></>}
                              <br />
                              <br />
                            </div>
                          </div>


                        </div >
                      </>
                    }
                    )}


                    {/* First display selectable assets */}
                    {
                      displayedResources.map(elem => {
                        return <>
                          <div className='blockin-listitem' style={{ alignItems: 'normal', width: '100%' }}>
                            {/* Metadata includes 1) chain logo, 2) asset name, 3) LinkComponent to asset, and 
                                                4) desccription of asset
                                             */}
                            <div className='blockin-listitem-metadata' style={{ alignItems: 'normal', width: '100%' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'normal' }}>
                                <div className='blockin-listitem-logo'>
                                  <img src={elem.image ? elem.image : "https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png"} height='50px' width='auto' style={{ height: 100, width: 'auto' }} />
                                </div>
                                {elem.image &&
                                  <div className='blockin-listitem-logo'>
                                    <img src={"https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png"} height='50px' width='auto' style={{ height: 100, width: 'auto' }} />
                                  </div>}
                              </div>
                              <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ marginTop: 16 }}><b style={{ fontSize: 22 }}>{elem.name}</b></div>
                                  {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                            fields to allow / disable selecting. */}
                                  <div className='blockin-listitem-button' style={{ alignItems: 'normal' }}>
                                    {
                                      <Switch
                                        checkedChildren=""
                                        unCheckedChildren=""
                                        checked={selectedUris.includes(`${elem.uri}`)}
                                        disabled={elem.frozen}
                                        onClick={() => {
                                          const alreadySelected = selectedUris.includes(`${elem.uri}`);

                                          if (!alreadySelected) {
                                            setSelectedUris([...selectedUris, `${elem.uri}`]);
                                          } else {
                                            const newArr = selectedUris.filter(resource => resource !== `${elem.uri}`)
                                            setSelectedUris(newArr);
                                          }
                                        }}
                                      />
                                    }
                                  </div>
                                </div>


                                <br />
                                <br />
                                <a
                                  className="blockin-link"
                                  href={`${elem.uri}`}
                                  target="_blank"
                                  rel="noreferrer">
                                  Link
                                </a> - {elem.description}
                                <br />
                                <br />
                                {elem.additionalDisplay}
                              </div>
                            </div>
                          </div>
                        </>
                      }
                      )
                    }
                  </>
                  }
                </>
                }
              </div >








              {/* Final Sign Challenge Button. Calls signChallenge() and verifyChallenge(). */}
              < div className='blockin-sign-challenge-button' >
                <br /><Typography.Text strong style={{ color: 'inherit', fontSize: 22 }} >Sign Challenge and Submit</Typography.Text>
                <p>Once you click the button below, this site will send a signature request to your connected {chain.name} wallet.
                  This is a simple message signature. It is not a transaction and is free of charge.
                  Only sign this message if you trust this site and all of the information above is correct.
                </p>
                {/* <br /> */}
                {/* Loading Spinner */}
                {loading ? <> <div className='flex-center flex-column'><b>{loading}</b><br /><br /><Spin size="large" /><br /><br /></div></> : <></>}
                {displayMessage && <b style={{ color: 'red' }}><p>Oops! We ran into an error.</p><p>Error message: {displayMessage}</p></b>}
                <br />
                <div className='flex-center'>
                  <button className='blockin-button' onClick={handleSignIn} disabled={loading ? true : false}>
                    {preSignature ? 'Sign' : 'Sign In'}
                  </button>
                </div>

              </div >
            </div >
          </div >
        </Col >
      </>
    }
  </div >;
}

export default BlockinUIDisplay