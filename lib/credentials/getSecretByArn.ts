import {Secret, SecretAttributes} from 'aws-cdk-lib/aws-secretsmanager';
import {Construct} from 'constructs';

export const getSecretByArn = (parent: Construct, id: string, {secretCompleteArn: arn}: SecretAttributes) => {
    const secretByArn = Secret.fromSecretAttributes(parent, id, {secretCompleteArn: arn});
    return secretByArn.secretValueFromJson(id).unsafeUnwrap().toString();
};
