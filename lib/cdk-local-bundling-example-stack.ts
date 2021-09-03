import * as cdk from '@aws-cdk/core';
import { Code, Runtime, Function} from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { execSync } from 'child_process';

export class CdkLocalBundlingExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const functionDir = path.join(__dirname, "functions", "exampleFunction")

    const exampleFunction = new Function(this, "ExampleFunction", {
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: Runtime.PYTHON_3_8.bundlingImage,
          local: {
            tryBundle(outputDir: string) {
              try {
                execSync('pip3 --version')
              } catch {
                return false
              }

              execSync(`pip install -r ${path.join(functionDir, "requirements.txt")} -t ${path.join(outputDir)}`)
              execSync(`cp -au ${functionDir}/* ${path.join(outputDir)}`)
              return true
            }
          }
        }
      })
    })
  }
}
