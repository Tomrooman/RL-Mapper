/* eslint-disable no-use-before-define */
import React, { useState, useEffect, ChangeEvent } from 'react';
/* eslint-enable no-use-before-define */
const fs = window.require('fs');

interface dataType {
    RL: {
        map: {
            status: boolean,
            default: {
                path: string,
                name: string
            },
            workshop: {
                path: string
            }
        }
    }
}

const Main = (): React.ReactElement => {
    const [loaded, setLoaded] = useState(false);
    const [dataPath, setDataPath] = useState('');
    const [data, setData] = useState({} as dataType);
    const [workshopFiles, setWorkshopFiles] = useState([] as string[]);
    const [activeFile, setActivefile] = useState(false);

    useEffect(() => {
        if (!loaded) {
            const path = process.env.NODE_ENV === 'production' ? './resources/app/src' : './src';
            const content = JSON.parse(fs.readFileSync(path + '/data.json', 'utf8'));
            setDataPath(path);
            setData(content);
            if (content.RL.map.workshop.path) getWorkshopList(content.RL.map.workshop.path);
            setLoaded(true);
        }
    });

    const getWorkshopList = (path: string): void => {
        const files: string[] = [];
        fs.readdirSync(path).forEach((file: string) => {
            if (file.slice(-4) === '.udk') files.push(file);
        });
        setWorkshopFiles(files);
    };

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>, type: string): void => {
        if (e && e.target && e.target.files && e.target.files.length) {
            if (type === 'default') {
                if (data.RL.map.default) {
                    if (data.RL.map.status) {
                        fs.unlinkSync(data.RL.map.default.path);
                        fs.copyFileSync(dataPath + '/saved/' + data.RL.map.default.name, data.RL.map.default.path);
                    }
                    fs.unlinkSync(dataPath + '/saved/' + data.RL.map.default.name);
                }
                const filePath = (e.target.files[0] as any).path;
                const filename = filePath.split('\\')[filePath.split('\\').length - 1];
                data.RL.map.default.path = filePath;
                data.RL.map.default.name = filename;
                fs.copyFileSync(filePath, dataPath + '/saved/' + filename);
            }
            else if (type === 'workshop') {
                const splittedPath = (e.target.files[0] as any).path.split('\\');
                const path = splittedPath.slice(0, splittedPath.length - 1).join('\\');
                data.RL.map.workshop.path = path;
                getWorkshopList(path);
            }
            setData({ ...data });
            fs.writeFileSync(dataPath + '/data.json', JSON.stringify(data));
        }
    };

    if (loaded) {
        return (
            <div>
                <h1 className='mainTitle'>Rocket League Mapper</h1>
                <div className='menuContainer'>
                    <div className='menuSplit'>
                        <h3 className='defaultMapTitle'>Map à remplacer</h3>
                        <p className='defaultInfosFolder'>%GAME_FOLDER%\TAGame\CookedPCConsole\</p>
                        <input type='file' id='defaultMapPath' onChange={(e): void => handleSelectFile(e, 'default')} />
                        <div className='bottomPath'>
                            {data.RL.map.default ?
                                <p className='path pathG'>{data.RL.map.default.name}</p> :
                                <p className='path pathR'>Aucun fichier sélectionné</p>
                            }
                        </div>
                    </div>
                    <div className='menuSplit'>
                        <h3 className='workshopMapTitle'>Dossier des maps du workshop (.udk)</h3>
                        <input type='file' id='folderMapPath' onChange={(e): void => handleSelectFile(e, 'workshop')} />
                        <div className='bottomPath'>
                            {data.RL.map.workshop.path ?
                                <p className='path pathG'>{data.RL.map.workshop.path}</p> :
                                <p className='path pathR'>Aucun dossier sélectionné</p>
                            }
                        </div>
                    </div>
                </div>
                {workshopFiles && workshopFiles.length ?
                    <div className='workshopListContainer'>
                        {workshopFiles.map((file, index) => {
                            return (
                                <div className='workshopItem' key={index}>
                                    <p>{file}</p>
                                </div>
                            );
                        })} </div> :
                    <div className='workshopListContainerEmpty'>
                        <div className='workshopListEmpty'>
                            <h1>Pas de dossier sélectionné</h1>
                        </div>
                    </div>}
                <div className='actionContainer'>
                    <span className={activeFile ? 'btnApply' : 'btnApplyDisabled'}>Appliquer</span>
                    <span className={data.RL.map.default.path ? 'btnDefault' : 'btnDefaultDisabled'}>Remettre par défaut</span>
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
