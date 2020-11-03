/* eslint-disable no-use-before-define */
import React, { useState, useEffect, ChangeEvent } from 'react';
/* eslint-enable no-use-before-define */
const fs = window.require('fs');

interface dataType {
    RL: {
        map: {
            default: string,
            folder: string,
            custom: string
        }
    }
}

const Main = (): React.ReactElement => {
    const [dataPath, setDataPath] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({} as dataType);

    useEffect(() => {
        if (!loaded) {
            console.log('NODE : ', process.env.NODE_ENV);
            const path = process.env.NODE_ENV === 'production' ? './resources/app/src/data.json' : './src/data.json';
            const content = JSON.parse(fs.readFileSync(path, 'utf8'));
            setDataPath(path);
            setData(content);
            setLoaded(true);
        }
    });

    const handleSelectDirectory = (e: ChangeEvent<HTMLInputElement>): void => {
        // fs.writeFileSync(dataPath, JSON.stringify(data))
        if (e && e.target && e.target.files && e.target.files.length) {
            console.log('File 0 ', e.target.files[0]);
            // const path = e.target.files[0].path?.split('/').slice(0, e.target.files.length - 1);
            // console.log('E : ', path);
        }
    };

    return (
        <div>
            <h1 className='mainTitle'>Rocket League Mapper</h1>
            <div className='menuContainer'>
                <div className='menuSplit'>
                    <h3>Chemin de la map à remplacer</h3>
                    <input type='file' id='defaultMapPath' />
                    <p>{data.RL && data.RL.map.default ? data.RL.map.default : 'Aucun fichier sélectionné'}</p>
                </div>
                <div className='menuSplit'>
                    <h3>Chemin du dossier contenant vos maps du workshop (.udk)</h3>
                    <input type='file' id='folderMapPath' onChange={handleSelectDirectory} />
                    <p>{data.RL && data.RL.map.folder ? data.RL.map.folder : 'Aucun dossier sélectionné'}</p>
                </div>
            </div>
        </div>
    );
};

export default Main;
