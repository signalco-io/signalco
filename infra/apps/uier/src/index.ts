import { nextJsApp } from '@infra/pulumi/vercel';

const up = async () => {
    nextJsApp('uier', 'uier');
};

export default up;