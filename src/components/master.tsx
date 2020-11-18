/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
/* eslint-enable no-use-before-define */
import Workshop from './workshop';
import Rankings from './rankings';

const Master = (): React.ReactElement => {
    const [showedComponent, setShowedComponent] = useState('MMR');

    if (showedComponent === 'workshop') {
        return (
            <Workshop setShowedComponent={setShowedComponent} />
        );
    }
    else if (showedComponent === 'MMR') {
        return (
            <Rankings setShowedComponent={setShowedComponent} />
        );
    }
    else {
        return (
            <></>
        );
    }
};

export default Master;
