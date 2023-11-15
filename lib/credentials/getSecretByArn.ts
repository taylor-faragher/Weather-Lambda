import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export const getSecretByArn = (parent: Construct, id: string, arn: any) => {
    const secretByArn = Secret.fromSecretAttributes(parent, id, arn);
    return secretByArn.secretValueFromJson(id).unsafeUnwrap().toString();
}