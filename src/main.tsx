/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
/* eslint-enable no-use-before-define */
const fs = window.require('fs');

interface dataType {
    status: boolean,
    map: {
        default: {
            path: string,
            name: string
        },
        workshop: {
            path: string
        }
    }
}

interface filesType {
    name: string,
    thumbnail: false | string
}

const Main = (): React.ReactElement => {
    const [loaded, setLoaded] = useState(false);
    const [dataPath, setDataPath] = useState('');
    const [data, setData] = useState({} as dataType);
    const [workshopFiles, setWorkshopFiles] = useState([] as filesType[]);
    const [activeFile, setActivefile] = useState('');

    useEffect(() => {
        if (!loaded) {
            const path = process.env.NODE_ENV === 'production' ? './resources/app/src' : './src';
            const content = JSON.parse(fs.readFileSync(path + '/data.json', 'utf8'));
            setDataPath(path);
            setData(content);
            if (content.map.workshop.path) getWorkshopList(content.map.workshop.path, 'default', path);
            setLoaded(true);
        }
    });

    const getWorkshopList = (path: string, type: string, funcDataPath: string): void => {
        const files: filesType[] = [];
        const pictures: string[] = [];
        if (type === 'update') {
            fs.readdirSync(funcDataPath + '/saved/thumbnails/').forEach((file: string) => {
                fs.unlinkSync(funcDataPath + '/saved/thumbnails/' + file);
            });
        }
        fs.readdirSync(path).forEach((file: string) => {
            if (file.slice(-4) === '.udk') files.push({ name: file, thumbnail: false });
            if (file.slice(-4) === '.png' ||
                file.slice(-4) === '.jpg') pictures.push(file);
        });
        files.map(file => {
            return pictures.forEach(picture => {
                if (type === 'update') fs.copyFileSync(path + '\\' + picture, funcDataPath + '/saved/thumbnails/' + picture);
                if (picture.slice(0, picture.length - 4) === file.name.slice(0, file.name.length - 4)) file.thumbnail = funcDataPath + '/saved/thumbnails/' + picture;
            });
        });
        setWorkshopFiles(files);
    };

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>, type: string): void => {
        if (e && e.target && e.target.files && e.target.files.length) {
            if (type === 'default') {
                if (data.map.default.path) {
                    if (data.status) {
                        // If map is modified, remove workshop file in %RL_FOLDER% and place the saved one in it
                        fs.unlinkSync(data.map.default.path);
                        fs.copyFileSync(dataPath + '/saved/map/' + data.map.default.name, data.map.default.path);
                    }
                    fs.unlinkSync(dataPath + '/saved/map/' + data.map.default.name);
                }
                const filePath = (e.target.files[0] as any).path;
                const filename = filePath.split('\\')[filePath.split('\\').length - 1];
                data.map.default.path = filePath;
                data.map.default.name = filename;
                fs.copyFileSync(filePath, dataPath + '/saved/map/' + filename);
            }
            else if (type === 'workshop') {
                const splittedPath = (e.target.files[0] as any).path.split('\\');
                const path = splittedPath.slice(0, splittedPath.length - 1).join('\\');
                data.map.workshop.path = path;
                getWorkshopList(path, 'update', dataPath);
            }
            setData({ ...data });
            fs.writeFileSync(dataPath + '/data.json', JSON.stringify(data));
        }
    };

    const handleSelectWorkshopMap = (e: React.MouseEvent<HTMLElement>): void => {
        const filename = (e.target as HTMLElement).innerText;
        if (activeFile === filename) setActivefile('');
        else setActivefile((e.target as HTMLElement).innerText);
    };

    const handleApplyWorkshopMap = (): void => {
        if (activeFile.length && data.map.default.path) {
            fs.unlinkSync(data.map.default.path);
            fs.copyFileSync(data.map.workshop.path + '/' + activeFile, data.map.default.path);
            data.status = true;
            setData({ ...data });
            fs.writeFileSync(dataPath + '/data.json', JSON.stringify(data));
        }
    };

    const handleApplyDefaultMap = (): void => {
        if (data.map.default.path && data.status) {
            fs.unlinkSync(data.map.default.path);
            fs.copyFileSync(dataPath + '/saved/map/' + data.map.default.name, data.map.default.path);
            data.status = false;
            setData({ ...data });
            fs.writeFileSync(dataPath + '/data.json', JSON.stringify(data));
        }
    };

    if (loaded) {
        return (
            <div>
                <span className='mainTitle'>
                    <div className='statusContainer'>
                        <span className='statusLabel'>
                            <p>Statut:</p>
                        </span>
                        <span className={data.status ? 'statusValue pathG' : 'statusValue pathR'}>
                            <p>{data.status ? 'Map modifiée' : 'Non modifiée'}</p>
                        </span>
                    </div>
                    <h1>Rocket League Mapper</h1>
                </span>
                <div className='menuContainer'>
                    <div className='menuSplit'>
                        <h3 className='defaultMapTitle'>Map à remplacer</h3>
                        <p className='defaultInfosFolder'>%GAME_FOLDER%\TAGame\CookedPCConsole\</p>
                        <input
                            type='file'
                            id='defaultMapPath'
                            onChange={(e): void => handleSelectFile(e, 'default')}
                        />
                        <div className='bottomPath'>
                            {data.map.default ?
                                <p className='path pathG'>{data.map.default.name}</p> :
                                <p className='path pathR'>Aucun fichier sélectionné</p>
                            }
                        </div>
                    </div>
                    <div className='menuSplit'>
                        <h3 className='workshopMapTitle'>Dossier des maps du workshop (.udk)</h3>
                        <input
                            type='file'
                            id='folderMapPath'
                            onChange={(e): void => handleSelectFile(e, 'workshop')}
                        />
                        <div className='bottomPath'>
                            {data.map.workshop.path ?
                                <p className='path pathG'>{data.map.workshop.path}</p> :
                                <p className='path pathR'>Aucun dossier sélectionné</p>
                            }
                        </div>
                    </div>
                </div>
                {workshopFiles && workshopFiles.length ?
                    <div className='workshopListContainer'>
                        <h3>Mes maps du workshop</h3>
                        {workshopFiles.map((file, index) => {
                            return (
                                <div
                                    className={file.name === activeFile ? 'workshopItem active' : 'workshopItem'}
                                    key={index}
                                    onClick={handleSelectWorkshopMap}
                                >
                                    <img src={file.thumbnail ? file.thumbnail : dataPath + '/assets/thumbnail/default.png'} />
                                    <p>{file.name}</p>
                                </div>
                            );
                        })} </div> :
                    <div className='workshopListContainerEmpty'>
                        <div className='workshopListEmpty'>
                            <h1>Pas de dossier sélectionné</h1>
                        </div>
                    </div>}
                <div className='actionContainer'>
                    <span
                        className={activeFile.length && data.map.default.path ? 'btnApply' : 'btnApplyDisabled'}
                        onClick={handleApplyWorkshopMap}
                    >
                        Appliquer
                    </span>
                    <span
                        className={data.map.default.path && data.status ? 'btnDefault' : 'btnDefaultDisabled'}
                        onClick={handleApplyDefaultMap}
                    >
                        Remettre par défaut
                    </span>
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
