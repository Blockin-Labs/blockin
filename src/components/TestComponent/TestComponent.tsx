import React, { useState } from "react";

import { TestComponentProps } from "./TestComponent.types";

import "./TestComponent.scss";

import { constructChallengeStringFromChallengeObject } from "../../verify";
// import { setChainDriver } from "../../blockin";
// import { AlgoDriver } from "../../ChainDrivers/AlgoDriver";

const TestComponent: React.FC<TestComponentProps> = ({ heading, content }) => {
    const [testing, setTesting] = useState('');

    const handleCreateChallenge = async () => {
        // setChainDriver(new AlgoDriver('Testnet'));
        const c = await constructChallengeStringFromChallengeObject({ domain: 'https://blockin.edu', statement: 'asfad', address: 'A3KW6EZITJQTIHIVZUMN2BVG7DBKEBSGEJBIGEXQ4CPBQV6XAUQKZ5RRWA', uri: 'https://blockin.edu', nonce: '123', version: '1', chainId: 'ALL', issuedAt: new Date().toISOString() });
        setTesting(c);
    }

    return <div data-testid="test-component" className="test-component">
        <h1 data-testid="test-component__heading" className="heading">
            {heading}
            {testing}
            <button onClick={async () => await handleCreateChallenge()}>Click 4 Challenge</button>
        </h1>
        <div data-testid="test-component__content">{content}</div>
    </div>
}



export default TestComponent;
