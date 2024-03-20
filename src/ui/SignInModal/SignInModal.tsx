// Generated with util/create-component.js
import { Col, InputNumber, Spin, Switch, Typography } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import {
    createChallenge,
    generateAssetConditionGroupString,
    parseChallengeAssets,
} from '../../verify';
import { getChain } from '../SupportedChains';
import {
    AssetConditionGroupWithUIDetails,
    PresetUri,
    SignInModalProps,
} from './SignInModal.types';
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import './SignInModal.scss';
import {
    AndGroup,
    ChallengeParams,
    NumberType,
    OrGroup,
    OwnershipRequirements,
} from '../../types/verify.types';

/*
 * Gets the default selected resources from the passed-in props
 * @param resources Resources passed in as props
 * @returns Array of formatted string[] resources
 */
const getDefaultSelectedResources = (
    resources: PresetUri[],
    assets: AssetConditionGroupWithUIDetails<NumberType>[]
) => {
    const selectedUris: string[] = [];
    const selectedAssets: string[] = [];
    for (const resource of resources) {
        if (resource.defaultSelected) {
            selectedUris.push(`${resource.uri}`);
        }
    }

    for (const asset of assets) {
        if (asset.defaultSelected) {
            selectedAssets.push(`${asset.name}`);
        }
    }

    return {
        selectedUris,
        selectedAssets,
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
    displayedResources,
    displayedAssetGroups,
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
    nonWalletSignIn = false,
}) => {
    displayedResources = displayedResources ?? [];
    displayedAssetGroups = displayedAssetGroups ?? [];

    const [displayMessage, setDisplayMessage] = useState('');
    const [chain, setChain] = useState(
        getChain(selectedChainName, selectedChainInfo)
    );
    const [loading, setLoading] = useState('');

    const [advancedIsVisible, setAdvancedIsVisible] = useState(false);

    const [currSiteOrigin, setCurrSiteOrigin] = useState('');

    const trustedDomains = ['http://localhost:3000', 'https://bitbadges.io'];
    const domainDifferentFromOrigin =
        !challengeParams?.domain || challengeParams.domain !== currSiteOrigin;
    const onTrustedOrigin =
        !domainDifferentFromOrigin ||
        trustedDomains.includes(challengeParams?.domain ?? '');

    useEffect(() => {
        setCurrSiteOrigin(window.location.origin);
    }, []);

    const [hours, setHours] = useState(24);

    const [selectedUris, setSelectedUris] = useState<string[]>(
        getDefaultSelectedResources(displayedResources, displayedAssetGroups)
            .selectedUris
    );
    const [selectedAssets, setSelectedAssets] = useState<string[]>(
        getDefaultSelectedResources(displayedResources, displayedAssetGroups)
            .selectedAssets
    );

    useEffect(() => {
        const res = getDefaultSelectedResources(
            displayedResources,
            displayedAssetGroups
        );
        setSelectedUris(res.selectedUris);
        setSelectedAssets(res.selectedAssets);
        setDisplayMessage('');
    }, [displayedResources.length, displayedAssetGroups.length]);

    /**
     * This will be true when 1) there are no selectable resources passed in by provider and 2) user can not add custom
     * resources.
     */
    const resourcesAreHidden =
        displayedAssetGroups.length === 0 && displayedResources.length === 0;

    /**
     * Adds a resource that was added by the user to selectedUris. Formats in correct Blockin format
     * for assets vs. URIs.
     * @param resource ID / text that the user inputted
     * @param isAssetID If is an asset, we prefix with 'Asset ID: ' to match the Blockin interface
     */
    const addCustomResource = async (resource: string, isAssetID?: boolean) => {
        if (!resource) return;
        const resourceToAdd = isAssetID ? `Asset ID: ${resource}` : resource;
        const newArr = [...selectedUris, resourceToAdd];
        setSelectedUris(newArr);
    };

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
        challengeParams &&
        challengeParams.address &&
        challengeParams.domain &&
        challengeParams.statement &&
        challengeParams.uri &&
        challengeParams.nonce;

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

        const assetsToVerify: AssetConditionGroupWithUIDetails<NumberType>[] =
            selectedAssets.map(
                (asset) =>
                    displayedAssetGroups.find(
                        (elem) => `${elem.name}` === asset
                    ) as AssetConditionGroupWithUIDetails<NumberType>
            );
        if (assetsToVerify.some((x) => !x)) {
            setDisplayMessage('Error: Assets not found.');
            setLoading('');
            return;
        }

        const assetConditionGroups = assetsToVerify.map(
            (x) => x.assetConditionGroup
        );

        /**
         * Generate the challenge object by and input the selectedUris
         */
        const challenge: ChallengeParams<NumberType> = {
            ...challengeParams,
            resources: selectedUris,
            assetOwnershipRequirements:
                assetConditionGroups.length > 1
                    ? { $and: assetConditionGroups }
                    : assetConditionGroups[0],
            expirationDate: allowTimeSelect
                ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
                : challengeParams.expirationDate,
        };

        try {
            /**
             * Call Blockin to create the challenge string.
             */
            const challengeString = createChallenge(
                challenge,
                selectedChainName
            );

            setLoading('Awaiting signature and verification...');
            /**
             * Sign and verify the challenge using the passed in signAndVerifyChallenge() props function.
             *
             * Expects { success: boolean, message: string }
             */
            const { success, message } = await signAndVerifyChallenge(
                challengeString
            );

            setLoading('');
            /**
             * Handle success / failure
             */
            if (!success) {
                setDisplayMessage(message);
                setLoading('');
            } else {
                setDisplayMessage('');
                setSelectedUris(
                    getDefaultSelectedResources(
                        displayedResources,
                        displayedAssetGroups
                    ).selectedUris
                );
                setSelectedAssets(
                    getDefaultSelectedResources(
                        displayedResources,
                        displayedAssetGroups
                    ).selectedAssets
                );
                setModalIsVisible(false);
                setLoading('');
            }
        } catch (e) {
            console.log(e);
            setLoading('');
            setDisplayMessage(e.message);
        }
    };

    const generateHumanReadableTimeDetails = (
        notBefore?: string,
        expirationDate?: string
    ) => {
        if (!notBefore && !expirationDate) {
            return 'This sign-in will always be valid (no expiration date).';
        } else if (notBefore && !expirationDate) {
            return `This sign-in will have no expiration date but will not be valid until ${new Date(
                notBefore
            ).toLocaleString()}.`;
        } else if (!notBefore && expirationDate) {
            return `This sign-in will expire at ${new Date(
                expirationDate
            ).toLocaleString()}.`;
        } else if (notBefore && expirationDate) {
            return `This sign-in will expire at ${new Date(
                expirationDate
            ).toLocaleString()} and will not be valid until ${new Date(
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
                    <Col
                        span={24}
                        className="blockin-root"
                        onClick={(e) => {
                            if (
                                !(e.target as any).closest(
                                    '.blockin-popup-container'
                                )
                            ) {
                                //HACK: TS Hack
                                setModalIsVisible(false); // Close the modal
                                setDisplayMessage('');
                                setSelectedUris(
                                    getDefaultSelectedResources(
                                        displayedResources,
                                        displayedAssetGroups
                                    ).selectedUris
                                );
                                setSelectedAssets(
                                    getDefaultSelectedResources(
                                        displayedResources,
                                        displayedAssetGroups
                                    ).selectedAssets
                                );
                            }
                            // setModalIsVisible(!modalIsVisible);
                            // e.stopPropagation();
                            // e.preventDefault();
                        }}
                    >
                        <div
                            className="blockin-popup-container modal-style-override"
                            style={modalStyle}
                            onClick={(e) => {
                                // e.stopPropagation();
                                // e.preventDefault();
                            }}
                        >
                            <div
                                className="blockin-popup modal-style-override"
                                style={modalStyle}
                            >
                                {displayNotConnnectedWarning && (
                                    <>
                                        <div className="flex-center">
                                            <b
                                                style={{
                                                    color: 'orange',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Warning: Your wallet is not
                                                currently connected.
                                            </b>
                                        </div>

                                        <br />
                                    </>
                                )}
                                {/* Header with the Close Button */}
                                <div className="blockin-header">
                                    <div className="header-end"></div>
                                    <div className="header-middle">
                                        <div
                                            className="blockin-header-chain-info"
                                            style={{ marginTop: 10 }}
                                        >
                                            <div>
                                                <img
                                                    src={chain.logo}
                                                    height="100px"
                                                    width="auto"
                                                    style={{
                                                        height: 100,
                                                        width: 'auto',
                                                    }}
                                                />
                                                <br />
                                                <b style={{ fontSize: 18 }}>
                                                    {chain.name}
                                                </b>
                                            </div>
                                            <div></div>
                                            <div>
                                                <a
                                                    href="https://blockin.gitbook.io/blockin/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="blockin-link"
                                                >
                                                    <img
                                                        src={
                                                            'https://github.com/Blockin-Labs/blockin/blob/main/images/blockin.png?raw=true'
                                                        }
                                                        height="100px"
                                                        width="auto"
                                                        style={{
                                                            height: 100,
                                                            width: 'auto',
                                                        }}
                                                    />
                                                    <br />
                                                    <b style={{ fontSize: 18 }}>
                                                        Blockin
                                                    </b>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="header-end"></div>
                                </div>

                                {/* Challenge Details */}
                                <div className="blockin-challenge">
                                    <br />
                                    <Typography.Text
                                        strong
                                        style={{
                                            color: 'inherit',
                                            fontSize: 22,
                                        }}
                                    >
                                        Sign-In Details
                                    </Typography.Text>
                                    {challengeParamsAreValid ? (
                                        <>
                                            <div className="blockin-challenge-details">
                                                {challengeParams.uri !==
                                                    challengeParams.domain && (
                                                    <>
                                                        <p>
                                                            <b>
                                                                <LinkComponent
                                                                    url={
                                                                        challengeParams.uri
                                                                    }
                                                                />
                                                            </b>
                                                        </p>
                                                    </>
                                                )}
                                                <p>
                                                    <b>
                                                        <LinkComponent
                                                            url={
                                                                challengeParams.domain
                                                            }
                                                        />{' '}
                                                        wants you to sign in
                                                        with your {chain.name}{' '}
                                                        account:{' '}
                                                        {
                                                            <LinkComponent
                                                                text={
                                                                    challengeParams.address
                                                                }
                                                                url={
                                                                    chain.getAddressExplorerUrl
                                                                        ? chain.getAddressExplorerUrl(
                                                                              challengeParams.address
                                                                          )
                                                                        : ''
                                                                }
                                                            />
                                                        }
                                                    </b>
                                                </p>
                                                <p>
                                                    <b>
                                                        {
                                                            challengeParams.statement
                                                        }
                                                    </b>
                                                </p>
                                                {challengeParams.issuedAt && (
                                                    <>
                                                        <p>
                                                            <b>
                                                                This sign-in
                                                                request was
                                                                issued at{' '}
                                                                {new Date(
                                                                    challengeParams.issuedAt
                                                                ).toLocaleString()}
                                                            </b>
                                                        </p>
                                                    </>
                                                )}

                                                {allowTimeSelect ? (
                                                    <>
                                                        <div
                                                            className="flex"
                                                            style={{
                                                                alignItems:
                                                                    'center',
                                                                marginTop: 4,
                                                            }}
                                                        >
                                                            <b>
                                                                Remember my
                                                                sign-in for
                                                                <InputNumber
                                                                    value={
                                                                        hours
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) => {
                                                                        if (
                                                                            value
                                                                        )
                                                                            setHours(
                                                                                value
                                                                            );
                                                                    }}
                                                                    min={1}
                                                                    max={
                                                                        maxTimeInFuture
                                                                            ? maxTimeInFuture /
                                                                              (1000 *
                                                                                  60 *
                                                                                  60)
                                                                            : undefined
                                                                    }
                                                                    style={{
                                                                        width: 70,
                                                                        marginLeft: 10,
                                                                        marginRight: 10,
                                                                    }}
                                                                />
                                                                hours
                                                            </b>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p>
                                                        <b>
                                                            {generateHumanReadableTimeDetails(
                                                                challengeParams.notBefore,
                                                                challengeParams.expirationDate
                                                            )}
                                                        </b>
                                                    </p>
                                                )}

                                                {/* Would probably be nice to have an "Advanced" section here where the user can see all of the below fields which 99% wont understand */}
                                                {/* Don't show if undefined */}
                                                {/* <br/><Typography.Text strong style={{ color: 'inherit', fontSize: 22}} >Advanced Sign-In Details</Typography.Text><br/> */}
                                                <br />
                                                <button
                                                    className="blockin-button-secondary"
                                                    onClick={() =>
                                                        setAdvancedIsVisible(
                                                            !advancedIsVisible
                                                        )
                                                    }
                                                >
                                                    {advancedIsVisible
                                                        ? 'Hide'
                                                        : 'Show Advanced'}
                                                </button>
                                                {advancedIsVisible && (
                                                    <div
                                                        style={{
                                                            marginTop: 16,
                                                        }}
                                                    >
                                                        <p>
                                                            <b>
                                                                Nonce:{' '}
                                                                {
                                                                    challengeParams.nonce
                                                                }
                                                            </b>
                                                        </p>
                                                        <p>
                                                            <b>
                                                                Chain ID:{' '}
                                                                {challengeParams.chainId
                                                                    ? challengeParams.chainId
                                                                    : '1 (Default)'}
                                                            </b>
                                                        </p>
                                                        <p>
                                                            <b>
                                                                Version:{' '}
                                                                {challengeParams.version
                                                                    ? challengeParams.version
                                                                    : '1 (Default)'}
                                                            </b>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <b>
                                                    Error: Challenge parameters
                                                    are invalid.
                                                </b>
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Challenge Resources Preset According to Props */}
                                <div className="blockin-preset-resources">
                                    {!resourcesAreHidden && (
                                        <>
                                            {(displayedResources.length !== 0 ||
                                                displayedAssetGroups.length !==
                                                    0) && (
                                                <>
                                                    <br />

                                                    <Typography.Text
                                                        strong
                                                        style={{
                                                            color: 'inherit',
                                                            fontSize: 22,
                                                        }}
                                                    >
                                                        Privileges
                                                    </Typography.Text>
                                                    {(displayedResources.some(
                                                        (x) => !x.frozen
                                                    ) ||
                                                        displayedAssetGroups.some(
                                                            (x) => !x.frozen
                                                        )) && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection:
                                                                    'row',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <InfoCircleOutlined
                                                                rev={''}
                                                                style={{
                                                                    marginRight: 4,
                                                                }}
                                                            />{' '}
                                                            Select the
                                                            privileges you meet
                                                            the criteria for and
                                                            would like to
                                                            receive.
                                                        </div>
                                                    )}
                                                    <br />
                                                    <br />

                                                    {displayedAssetGroups.map(
                                                        (elem) => {
                                                            const ownershipString =
                                                                generateAssetConditionGroupString(
                                                                    elem.assetConditionGroup,
                                                                    0,
                                                                    1,
                                                                    ''
                                                                );

                                                            const lines =
                                                                ownershipString.split(
                                                                    '\n'
                                                                );
                                                            let currChain =
                                                                'Ethereum';
                                                            let currCollectionId:
                                                                | string
                                                                | NumberType =
                                                                '';
                                                            const convertedLines: ReactNode[] =
                                                                [];
                                                            const chains: string[] =
                                                                [];

                                                            for (const line of lines) {
                                                                const trimmedLine =
                                                                    line.trim();

                                                                if (
                                                                    trimmedLine.startsWith(
                                                                        'Chain'
                                                                    )
                                                                ) {
                                                                    currChain =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    chains.push(
                                                                        currChain
                                                                    );
                                                                    continue;
                                                                } else if (
                                                                    trimmedLine.startsWith(
                                                                        'Asset IDs'
                                                                    )
                                                                ) {
                                                                    const chain =
                                                                        getChain(
                                                                            currChain,
                                                                            selectedChainInfo
                                                                        );
                                                                    const ids =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    const [
                                                                        start,
                                                                        end,
                                                                    ] = ids
                                                                        .split(
                                                                            ' to '
                                                                        )
                                                                        .map(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.trim()
                                                                        )
                                                                        .map(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                BigInt(
                                                                                    x
                                                                                )
                                                                        );
                                                                    if (
                                                                        start ===
                                                                        end
                                                                    ) {
                                                                        const Link =
                                                                            (
                                                                                <LinkComponent
                                                                                    url={
                                                                                        chain.getTokenExplorerUrl
                                                                                            ? chain.getTokenExplorerUrl(
                                                                                                  currCollectionId.toString(),
                                                                                                  start.toString()
                                                                                              )
                                                                                            : ''
                                                                                    }
                                                                                    text={start.toString()}
                                                                                />
                                                                            );
                                                                        convertedLines.push(
                                                                            <>
                                                                                {
                                                                                    line.split(
                                                                                        ': '
                                                                                    )[0]
                                                                                }

                                                                                :{' '}
                                                                                {
                                                                                    Link
                                                                                }
                                                                            </>
                                                                        );
                                                                    } else {
                                                                        convertedLines.push(
                                                                            line
                                                                        );
                                                                    }
                                                                } else if (
                                                                    trimmedLine.startsWith(
                                                                        'Asset ID'
                                                                    )
                                                                ) {
                                                                    //string or a number
                                                                    const chain =
                                                                        getChain(
                                                                            currChain,
                                                                            selectedChainInfo
                                                                        );
                                                                    const assetId =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    const Link =
                                                                        (
                                                                            <LinkComponent
                                                                                url={
                                                                                    chain.getTokenExplorerUrl
                                                                                        ? chain.getTokenExplorerUrl(
                                                                                              currCollectionId.toString(),
                                                                                              assetId.toString()
                                                                                          )
                                                                                        : ''
                                                                                }
                                                                                text={assetId.toString()}
                                                                            />
                                                                        );
                                                                    convertedLines.push(
                                                                        <>
                                                                            {
                                                                                line.split(
                                                                                    ': '
                                                                                )[0]
                                                                            }
                                                                            :{' '}
                                                                            {
                                                                                Link
                                                                            }
                                                                        </>
                                                                    );
                                                                } else if (
                                                                    trimmedLine.startsWith(
                                                                        'Ownership Times'
                                                                    )
                                                                ) {
                                                                    const ownershipTimes =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    const timeRange =
                                                                        ownershipTimes.split(
                                                                            'to'
                                                                        );
                                                                    if (
                                                                        timeRange.length ==
                                                                        1
                                                                    ) {
                                                                        console.log(
                                                                            ownershipTimes
                                                                        );
                                                                        const dateString =
                                                                            ownershipTimes.split(
                                                                                ' onwards'
                                                                            )[0];
                                                                        console.log(
                                                                            dateString
                                                                        );
                                                                        //onwards
                                                                        convertedLines.push(
                                                                            <>
                                                                                {
                                                                                    line.split(
                                                                                        ': '
                                                                                    )[0]
                                                                                }

                                                                                :{' '}
                                                                                {new Date(
                                                                                    dateString
                                                                                ).toLocaleString()}{' '}
                                                                                onwards
                                                                            </>
                                                                        );
                                                                    } else {
                                                                        //date range
                                                                        convertedLines.push(
                                                                            <>
                                                                                {
                                                                                    line.split(
                                                                                        ': '
                                                                                    )[0]
                                                                                }

                                                                                :{' '}
                                                                                {new Date(
                                                                                    timeRange[0].trim()
                                                                                ).toLocaleString()}{' '}
                                                                                to{' '}
                                                                                {new Date(
                                                                                    timeRange[1].trim()
                                                                                ).toLocaleString()}
                                                                            </>
                                                                        );
                                                                    }
                                                                } else if (
                                                                    trimmedLine.startsWith(
                                                                        'Ownership Time'
                                                                    )
                                                                ) {
                                                                    //date string or "Authentication Time"
                                                                    const time =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    if (
                                                                        time ===
                                                                        'Authentication Time'
                                                                    ) {
                                                                        convertedLines.push(
                                                                            line
                                                                        );
                                                                    } else {
                                                                        convertedLines.push(
                                                                            <>
                                                                                {
                                                                                    line.split(
                                                                                        ': '
                                                                                    )[0]
                                                                                }

                                                                                :{' '}
                                                                                {new Date(
                                                                                    Number(
                                                                                        BigInt(
                                                                                            time
                                                                                        )
                                                                                    )
                                                                                ).toLocaleString()}
                                                                            </>
                                                                        );
                                                                    }
                                                                } else if (
                                                                    trimmedLine.startsWith(
                                                                        'Collection ID'
                                                                    )
                                                                ) {
                                                                    //uint or string
                                                                    currCollectionId =
                                                                        trimmedLine
                                                                            .split(
                                                                                ': '
                                                                            )[1]
                                                                            .trim();
                                                                    const chain =
                                                                        getChain(
                                                                            currChain,
                                                                            selectedChainInfo
                                                                        );

                                                                    const link =
                                                                        (
                                                                            <LinkComponent
                                                                                url={
                                                                                    chain.getCollectionExplorerUrl
                                                                                        ? chain.getCollectionExplorerUrl(
                                                                                              currCollectionId.toString()
                                                                                          )
                                                                                        : ''
                                                                                }
                                                                                text={
                                                                                    chain.name +
                                                                                    ' Collection: ' +
                                                                                    currCollectionId.toString()
                                                                                }
                                                                            />
                                                                        );
                                                                    convertedLines.push(
                                                                        <>
                                                                            {
                                                                                line.split(
                                                                                    'Collection ID: '
                                                                                )[0]
                                                                            }
                                                                            {/* <img src={chain.logo} height='20px' width='auto' style={{ height: 20, width: 'auto', marginLeft: 4, marginRight: 4 }} /> */}

                                                                            {
                                                                                link
                                                                            }
                                                                        </>
                                                                    );
                                                                } else {
                                                                    convertedLines.push(
                                                                        line
                                                                    );
                                                                }
                                                            }

                                                            return (
                                                                <>
                                                                    <div
                                                                        className="blockin-listitem"
                                                                        style={{
                                                                            alignItems:
                                                                                'normal',
                                                                        }}
                                                                    >
                                                                        {/* Metadata includes 1) chain logo, 2) asset name, 3) LinkComponent to asset, and 
                                            4) desccription of asset
                                         */}
                                                                        <div
                                                                            className="blockin-listitem-metadata"
                                                                            style={{
                                                                                alignItems:
                                                                                    'normal',
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        flexDirection:
                                                                                            'row',
                                                                                        justifyContent:
                                                                                            'space-between',
                                                                                        flexWrap:
                                                                                            'wrap',
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            display:
                                                                                                'flex',
                                                                                        }}
                                                                                    >
                                                                                        {elem.image && (
                                                                                            <div
                                                                                                style={{
                                                                                                    display:
                                                                                                        'flex',
                                                                                                    flexDirection:
                                                                                                        'column',
                                                                                                    alignItems:
                                                                                                        'normal',
                                                                                                }}
                                                                                            >
                                                                                                <div className="blockin-listitem-logo">
                                                                                                    <img
                                                                                                        src={
                                                                                                            elem.image
                                                                                                        }
                                                                                                        height="51px"
                                                                                                        width="auto"
                                                                                                        style={{
                                                                                                            height: 51,
                                                                                                            width: 'auto',
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: 16,
                                                                                            }}
                                                                                        >
                                                                                            <b
                                                                                                style={{
                                                                                                    fontSize: 22,
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    elem.name
                                                                                                }
                                                                                            </b>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                            fields to allow / disable selecting. */}
                                                                                    <div
                                                                                        className="blockin-listitem-button"
                                                                                        style={{
                                                                                            alignItems:
                                                                                                'normal',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            <Switch
                                                                                                checkedChildren=""
                                                                                                unCheckedChildren=""
                                                                                                checked={selectedAssets.includes(
                                                                                                    `${elem.name}`
                                                                                                )}
                                                                                                disabled={
                                                                                                    elem.frozen
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    const alreadySelected =
                                                                                                        selectedAssets.includes(
                                                                                                            `${elem.name}`
                                                                                                        );
                                                                                                    if (
                                                                                                        !alreadySelected
                                                                                                    ) {
                                                                                                        setSelectedAssets(
                                                                                                            [
                                                                                                                ...selectedAssets,
                                                                                                                `${elem.name}`,
                                                                                                            ]
                                                                                                        );
                                                                                                    } else {
                                                                                                        const newArr =
                                                                                                            selectedAssets.filter(
                                                                                                                (
                                                                                                                    resource
                                                                                                                ) =>
                                                                                                                    resource !==
                                                                                                                    `${elem.name}`
                                                                                                            );
                                                                                                        setSelectedAssets(
                                                                                                            newArr
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <br />{' '}
                                                                                {
                                                                                    elem.description
                                                                                }
                                                                                <br />
                                                                                <br />
                                                                                <b>
                                                                                    Ownership
                                                                                    Requirements
                                                                                </b>
                                                                                <br />
                                                                                <br />
                                                                                {convertedLines.map(
                                                                                    (
                                                                                        line
                                                                                    ) => {
                                                                                        //keep indentation

                                                                                        return (
                                                                                            <>
                                                                                                <div
                                                                                                    style={{
                                                                                                        whiteSpace:
                                                                                                            'pre-wrap',
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        line
                                                                                                    }
                                                                                                    <br />
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </div>

                                                                            {elem.additionalDisplay ? (
                                                                                <>
                                                                                    {
                                                                                        elem.additionalDisplay
                                                                                    }
                                                                                </>
                                                                            ) : (
                                                                                <>

                                                                                </>
                                                                            )}
                                                                            <br />
                                                                            <br />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        }
                                                    )}

                                                    {/* First display selectable assets */}
                                                    {displayedResources.map(
                                                        (elem) => {
                                                            return (
                                                                <>
                                                                    <div
                                                                        className="blockin-listitem"
                                                                        style={{
                                                                            alignItems:
                                                                                'normal',
                                                                            width: '100%',
                                                                        }}
                                                                    >
                                                                        {/* Metadata includes 1) chain logo, 2) asset name, 3) LinkComponent to asset, and 
                                                4) desccription of asset
                                             */}
                                                                        <div
                                                                            className="blockin-listitem-metadata"
                                                                            style={{
                                                                                alignItems:
                                                                                    'normal',
                                                                                width: '100%',
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    display:
                                                                                        'flex',
                                                                                    flexDirection:
                                                                                        'column',
                                                                                    alignItems:
                                                                                        'normal',
                                                                                }}
                                                                            >
                                                                                <div className="blockin-listitem-logo">
                                                                                    <img
                                                                                        src={
                                                                                            elem.image
                                                                                                ? elem.image
                                                                                                : 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png'
                                                                                        }
                                                                                        height="50px"
                                                                                        width="auto"
                                                                                        style={{
                                                                                            height: 100,
                                                                                            width: 'auto',
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                {elem.image && (
                                                                                    <div className="blockin-listitem-logo">
                                                                                        <img
                                                                                            src={
                                                                                                'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/43-512.png'
                                                                                            }
                                                                                            height="50px"
                                                                                            width="auto"
                                                                                            style={{
                                                                                                height: 100,
                                                                                                width: 'auto',
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        flexDirection:
                                                                                            'row',
                                                                                        justifyContent:
                                                                                            'space-between',
                                                                                        alignItems:
                                                                                            'center',
                                                                                        flexWrap:
                                                                                            'wrap',
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop: 16,
                                                                                        }}
                                                                                    >
                                                                                        <b
                                                                                            style={{
                                                                                                fontSize: 22,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                elem.name
                                                                                            }
                                                                                        </b>
                                                                                    </div>
                                                                                    {/* Button allows user to select / deselect asset. Uses passed in 'frozen' and 'defaultSelected'
                                            fields to allow / disable selecting. */}
                                                                                    <div
                                                                                        className="blockin-listitem-button"
                                                                                        style={{
                                                                                            alignItems:
                                                                                                'normal',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            <Switch
                                                                                                checkedChildren=""
                                                                                                unCheckedChildren=""
                                                                                                checked={selectedUris.includes(
                                                                                                    `${elem.uri}`
                                                                                                )}
                                                                                                disabled={
                                                                                                    elem.frozen
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    const alreadySelected =
                                                                                                        selectedUris.includes(
                                                                                                            `${elem.uri}`
                                                                                                        );

                                                                                                    if (
                                                                                                        !alreadySelected
                                                                                                    ) {
                                                                                                        setSelectedUris(
                                                                                                            [
                                                                                                                ...selectedUris,
                                                                                                                `${elem.uri}`,
                                                                                                            ]
                                                                                                        );
                                                                                                    } else {
                                                                                                        const newArr =
                                                                                                            selectedUris.filter(
                                                                                                                (
                                                                                                                    resource
                                                                                                                ) =>
                                                                                                                    resource !==
                                                                                                                    `${elem.uri}`
                                                                                                            );
                                                                                                        setSelectedUris(
                                                                                                            newArr
                                                                                                        );
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
                                                                                    rel="noreferrer"
                                                                                >
                                                                                    Link
                                                                                </a>{' '}
                                                                                -{' '}
                                                                                {
                                                                                    elem.description
                                                                                }
                                                                                <br />
                                                                                <br />
                                                                                {
                                                                                    elem.additionalDisplay
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Final Sign Challenge Button. Calls signChallenge() and verifyChallenge(). */}

                                <div className="blockin-sign-challenge-button">
                                    <br />
                                    <Typography.Text
                                        strong
                                        style={{
                                            color: 'inherit',
                                            fontSize: 22,
                                        }}
                                    >
                                        Submit
                                    </Typography.Text>
                                    {!nonWalletSignIn && (
                                        <p>
                                            Upon clicking the button below, this
                                            site will send a signature request
                                            to your connected {chain.name}{' '}
                                            wallet. This is a simple message
                                            signature. It is not a transaction
                                            and is free of charge. The signature
                                            of this message is your secret
                                            authentication code.
                                        </p>
                                    )}
                                    <p>
                                        <WarningOutlined
                                            style={{ color: 'orange' }}
                                        />{' '}
                                        Only proceed to sign this message if all
                                        of the information above is correct and
                                        you trust the site you are currently on
                                        ({currSiteOrigin}).
                                        {!onTrustedOrigin && (
                                            <span style={{ color: 'orange' }}>
                                                {' '}
                                                Note that the site you are
                                                currently on is different from
                                                the site to be authenticated on.
                                                This site ({currSiteOrigin})
                                                will be able to see your secret
                                                authentication code.
                                            </span>
                                        )}
                                        {customBeforeSigningWarning && (
                                            <span style={{ color: 'orange' }}>
                                                {' '}
                                                {customBeforeSigningWarning}
                                            </span>
                                        )}
                                    </p>
                                    {/* <br /> */}
                                    {/* Loading Spinner */}
                                    {loading ? (
                                        <>
                                            {' '}
                                            <div className="flex-center flex-column">
                                                <b>{loading}</b>
                                                <br />
                                                <br />
                                                <Spin size="large" />
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
                                            <p>
                                                Error message: {displayMessage}
                                            </p>
                                        </b>
                                    )}
                                    <br />
                                    <div className="flex-center">
                                        <button
                                            className="blockin-button"
                                            onClick={handleSignIn}
                                            disabled={loading ? true : false}
                                        >
                                            {preSignature ? 'Sign' : 'Sign In'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </>
            )}
        </div>
    );
};

export default SignInModal;
