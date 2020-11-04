/* eslint-disable no-use-before-define */
import React, { useState, useEffect, ChangeEvent } from 'react';
/* eslint-enable no-use-before-define */
const fs = window.require('fs');

interface dataType {
    RL: {
        map: {
            default: string,
            workshop: string
        }
    }
}

const Main = (): React.ReactElement => {
    const [loaded, setLoaded] = useState(false);
    const [dataPath, setDataPath] = useState('');
    const [data, setData] = useState({} as dataType);
    const [workshopFiles, setWorkshopFiles] = useState([]);

    useEffect(() => {
        if (!loaded) {
            const path = process.env.NODE_ENV === 'production' ? './resources/app/src/data.json' : './src/data.json';
            const content = JSON.parse(fs.readFileSync(path, 'utf8'));
            setDataPath(path);
            setData(content);
            if (content.RL.map.workshop) getWorkshopList(content.RL.map.workshop);
            setLoaded(true);
        }
    });

    const getWorkshopList = (path: string): void => {
        fs.readdirSync(path).forEach((file: string) => {
            if (file.slice(-4) === '.udk')
                console.log(file.slice(-4));
        });
    };

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>, type: string): void => {
        if (e && e.target && e.target.files && e.target.files.length) {
            if (type === 'default') data.RL.map.default = (e.target.files[0] as any).path;
            else if (type === 'workshop') {
                const splittedPath = (e.target.files[0] as any).path.split('\\');
                const path = splittedPath.slice(0, splittedPath.length - 1).join('\\');
                data.RL.map.workshop = path;
                getWorkshopList(path);
            }
            setData(data);
            fs.writeFileSync(dataPath, JSON.stringify(data));
        }
    };

    if (loaded) {
        return (
            <div>
                <h1 className='mainTitle'>Rocket League Mapper</h1>
                <div className='menuContainer'>
                    <div className='menuSplit'>
                        <h3>Chemin de la map à remplacer</h3>
                        <p className='defaultInfosFolder'>%ROCKET_LEAGUE_FOLDER%\TAGame\CookedPCConsole\</p>
                        <p>{data.RL.map.default ? data.RL.map.default : 'Aucun fichier sélectionné'}</p>
                        <input type='file' id='defaultMapPath' onChange={(e): void => handleSelectFile(e, 'default')} />
                    </div>
                    <div className='menuSplit'>
                        <h3>Chemin du dossier contenant vos maps du workshop (.udk)</h3>
                        <p>{data.RL.map.workshop ? data.RL.map.workshop : 'Aucun dossier sélectionné'}</p>
                        <input type='file' id='folderMapPath' onChange={(e): void => handleSelectFile(e, 'workshop')} />
                    </div>
                </div>
                <div className='workshopListContainer'>
                    {workshopFiles && workshopFiles.length ?
                        getWorkshopList :
                        <h2 className='workshopListEmpty'>Pas de dossier sélectionné</h2>
                    }
                </div>
            </div>
        );
    }
    else {
        return (
            <div />
        );
    }
};

export default Main;
