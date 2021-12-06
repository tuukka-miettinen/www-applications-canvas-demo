import MainContainer from './view/MainContainer.mjs';

const onStart = () => Neo.app({
    appPath : 'apps/canvas-demo/',
    mainView: MainContainer,
    name    : 'canvas-demo'
});

export {onStart as onStart};