/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
/* eslint-enable no-use-before-define */
import { exec } from 'child_process';
import Axios from 'axios';
import BottomMenu from './bottomMenu';

interface propsType {
    setShowedComponent: React.Dispatch<React.SetStateAction<string>>
}

interface MMRType {
    value: number,
    division: string,
    rank: string,
    icon: string,
    type: string | false,
    diff: number | false
}

const Rankings = (props: propsType): React.ReactElement => {
    let interval = false as any;
    const [loaded, setLoaded] = useState(false);
    const [doubleMMR, setDoubleMMR] = useState(false as boolean | MMRType);
    const [tripleMMR, setTripleMMR] = useState(false as boolean | MMRType);
    const [inGame, setInGame] = useState(false);

    useEffect(() => {
        if (!loaded) {
            getRocketStats();
            // rocketProcess();
            setLoaded(true);
        }
        return (): void => {
            setLoaded(false);
            setDoubleMMR(false);
            setTripleMMR(false);
            clearInterval(interval);
        };
    }, [props]);

    const getRocketStats = async (): Promise<void> => {
        console.log('GET STATS');
        const result = await Axios.get('https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198867439282/sessions');
        const ranks = result.data.data.items[0].matches;
        const double = ranks.filter((rank: any) => rank.metadata.playlist === 'Ranked Doubles 2v2');
        const triple = ranks.filter((rank: any) => rank.metadata.playlist === 'Ranked Standard 3v3');
        if ((!doubleMMR || !tripleMMR) && (double || triple)) {
            console.log('In condition');
            const doubleVal = double[0].stats.rating.value;
            const tripleVal = triple[0].stats.rating.value;
            if (!doubleMMR || doubleVal !== (doubleMMR as MMRType).value) {
                console.log('Set double MMR');
                setDoubleMMR({
                    value: doubleVal,
                    division: double[0].stats.rating.metadata.division,
                    rank: double[0].stats.rating.metadata.tier,
                    icon: double[0].stats.rating.metadata.iconUrl,
                    type: doubleMMR ? doubleVal > (doubleMMR as MMRType).value ? '+' : '-' : false,
                    diff: doubleMMR ? doubleVal > (doubleMMR as MMRType).value ? (doubleVal - (doubleMMR as MMRType).value) : ((doubleMMR as MMRType).value - doubleVal) : false
                });
            }
            if (!tripleMMR || tripleVal !== (tripleMMR as MMRType).value) {
                console.log('Set triple MMR');
                setTripleMMR({
                    value: tripleVal,
                    division: triple[0].stats.rating.metadata.division,
                    rank: triple[0].stats.rating.metadata.tier,
                    icon: triple[0].stats.rating.metadata.iconUrl,
                    type: tripleMMR ? tripleVal > (tripleMMR as MMRType).value ? '+' : '-' : false,
                    diff: tripleMMR ? tripleVal > (tripleMMR as MMRType).value ? (tripleVal - (tripleMMR as MMRType).value) : ((tripleMMR as MMRType).value - tripleVal) : false
                });
            }
        }
        console.log('double : ', doubleMMR);
        console.log('triple : ', tripleMMR);
    };

    const rocketProcess = (): void => {
        console.log('create interval');
        let inParty = false;
        const handles: number[] = [];
        interval = setInterval(async () => {
            // 'powershell.exe (Get-Process RocketLeague).handles'
            exec('powershell.exe (Get-Process RocketLeague).NPM', (_err, stdout, stderr) => {
                if (stdout) {
                    console.log('TEST PROCES : ', stdout);
                    if (parseInt(stdout) > 900 && handles.length < 3) handles.push(parseInt(stdout));
                    console.log('handlesArray : ', handles);
                    if (parseInt(stdout) >= 943) {
                        if (!inParty) inParty = true;
                        console.log('You are in a game');
                    }
                    else if (inParty) {
                        console.log('You leave the game');
                        inParty = false;
                    }
                    if (!inGame) setInGame(true);
                }
                else if (stderr) {
                    console.log('Rocket League not started !');
                    if (inGame) setInGame(false);
                }
            });
        }, 3000);
    };

    if (loaded) {
        return (
            <div className='RLContainer'>
                <span className='mainTitle mmr'>
                    <h1>Rocket League MMR</h1>
                </span>
                <span className='gameStatus'>
                    {inGame ?
                        <p className='pathG'>Rocket league est lancé</p> :
                        <p className='pathR'>Rocket league n'est pas lancé</p>
                    }
                </span>
                <div className='mmrContainer'>
                    <h3>2 VS 2</h3>
                    {doubleMMR ?
                        <>
                            <div className='icon'>
                                <img src={(doubleMMR as MMRType).icon} alt='rank_icon' />
                            </div>
                            <div className='valuesContainer'>
                                <div className='values'>
                                    <p>{(doubleMMR as MMRType).rank}</p>
                                    <p>{(doubleMMR as MMRType).division}</p>
                                    <p>{(doubleMMR as MMRType).value}</p>
                                </div>
                            </div>
                        </> :
                        <span className='loading'>
                            <h4>Chargement</h4>
                        </span>}
                </div>
                <div className='mmrContainer'>
                    <h3>3 VS 3</h3>
                    {tripleMMR ?
                        <>
                            <div className='icon'>
                                <img src={(tripleMMR as MMRType).icon} alt='rank_icon' />
                            </div>
                            <div className='valuesContainer'>
                                <div className='values'>
                                    <p>{(tripleMMR as MMRType).rank}</p>
                                    <p>{(tripleMMR as MMRType).division}</p>
                                    <p>{(tripleMMR as MMRType).value}</p>
                                </div>
                            </div>
                        </> :
                        <span className='loading'>
                            <h4>Chargement</h4>
                        </span>}
                </div>
                <BottomMenu
                    setShowedComponent={props.setShowedComponent}
                    type='MMR'
                    refresh={true}
                    getRocketStats={getRocketStats}
                />
            </div>
        );
    }
    else {
        return (
            <></>
        );
    }
};

export default Rankings;
