import React from 'react';
import Image from 'next/image';
import { StepContent } from './StepContent';
import { FeatureDescription } from './FeatureDescription';

export function PlaySection() {
    return (
        <StepContent
            header="Play"
            subtitle="Here are some of our favorite ways you can automate your life"
            image={<>
                <Image className="image--light" src={'/images/playpitch.png'} alt="Play" quality={100} width={511} height={684} />
                <Image className="image--dark" src={'/images/playpitch-dark.png'} alt="Play" quality={100} width={511} height={684} />
            </>}
            imageContainerHeight={684 + 64}
            imageContainerStyles={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '511px',
                height: '684px',
                marginTop: '64px'
            }}>
            <FeatureDescription
                header="Morning coffee"
                content="Raise the shades, play your favorite energizing morning beat and turn on the coffee maker." />
            <FeatureDescription
                header="Busywork"
                content="Create a list of Trello cards and GitHub tasks that need your attention today. Maybe you can automate some of them too." />
            <FeatureDescription
                header="TV time"
                content="Dim the lights, switch the TV to Netflix, and turn on do-not-disturb on your phone. Now is You time." />
            <FeatureDescription
                header="Rain alert"
                content="Notify me if today's forecast shows rain and windows are open. Ease your mind knowing you will get notified on time" />
        </StepContent>
    );
}
