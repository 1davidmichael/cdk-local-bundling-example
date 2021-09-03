import { expect as expectCDK, matchTemplate, MatchStyle, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as myApp from '../lib/cdk-local-bundling-example-stack'

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new myApp.CdkLocalBundlingExampleStack(app, 'MyTestStack');
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});