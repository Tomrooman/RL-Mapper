/* eslint-disable no-use-before-define */
import React from 'react';
/* eslint-enable no-use-before-define */
import { dataType } from '../@types/types';

interface WorkshopPropsType {
    setShowedComponent: React.Dispatch<React.SetStateAction<string>>,
    type: string,
    activeFile: string,
    data: dataType,
    handleApplyWorkshopMap(): void,
    handleApplyDefaultMap(): void
}

interface MMRPropsType {
    setShowedComponent: React.Dispatch<React.SetStateAction<string>>,
    type: string,
    refresh: boolean,
    getRocketStats(): void
}

const BottomMenu = (props: WorkshopPropsType | MMRPropsType): React.ReactElement => {
    return (
        <div className={props.type === 'workshop' ? 'actionContainer' : 'actionContainer rankings'}>
            <span
                className='workshopCategory'
                onClick={(): void => props.setShowedComponent('workshop')}
            >
                <p>workshop</p>
            </span>
            {props.type === 'workshop' ?
                <>
                    <span
                        className={(props as WorkshopPropsType).activeFile.length && (props as WorkshopPropsType).data.map.default.path ? 'btnApply' : 'btnApplyDisabled'}
                        onClick={(props as WorkshopPropsType).handleApplyWorkshopMap}
                    >
                        Appliquer
                    </span>
                    <span
                        className={(props as WorkshopPropsType).data.map.default.path && (props as WorkshopPropsType).data.status ? 'btnDefault' : 'btnDefaultDisabled'}
                        onClick={(props as WorkshopPropsType).handleApplyDefaultMap}
                    >
                        Remettre par défaut
                    </span>
                </> :
                ''}
            {(props as MMRPropsType).refresh ?
                <span
                    className='mmrCategory'
                    onClick={(): void => (props as MMRPropsType).getRocketStats()}
                >
                    <p>MMR</p>
                </span> :
                <span
                    className='mmrCategory'
                    onClick={(): void => props.setShowedComponent('MMR')}
                >
                    <p>MMR</p>
                </span>}
        </div>
    );
};

export default BottomMenu;
