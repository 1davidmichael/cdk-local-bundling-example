# Example Python CDK Bundling

With the [PythonFunction CDK Construct] the CDK attempts to use Docker to bundle the dependencies within the generated CloudArtifact or construct package. For an unknown reason this fails when using a Docker environment like GitHub Actions.

Issues tracking this:
* https://github.com/aws/aws-cdk/issues/12940
* https://github.com/aws/aws-cdk/issues/11230

As an alternative this project demonstrates using the [localBundling] CDK option with Python to generate the compatible CloudArtifact. Hopefully this will be resolved soon and no longer necessary.

```typescript
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

```

[PythonFunction CDK Construct]: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-python-readme.html
[localBundling]: https://aws.amazon.com/blogs/devops/building-apps-with-aws-cdk/
