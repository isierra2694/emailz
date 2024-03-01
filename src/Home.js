import EmailTemplate from './EmailTemplate';
import { useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import ExpandableItem from './ExpandableItem';

export default function Home() {
    const [sheet, setSheet] = useState(null);
    const [rows, setRows] = useState(null);
    const [templates, setTemplates] = useState({});
    const [loaded, setLoaded] = useState(undefined);

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // check if the templates are already in local storage, if so, load
        const storedTemplates = JSON.parse(localStorage.getItem('templates')) || {};
        if (Object.keys(storedTemplates).length !== 0) {
            setTemplates(storedTemplates);
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites(storedFavorites);
            setLoaded(true);
        }

        // get templates from google sheets
        const fetch = async () => {
            try {
                const doc = new GoogleSpreadsheet('PUT_GOOGLE_SHEETS_URL_HERE', { apiKey: 'PUT_API_KEY_HERE' });
                await doc.loadInfo();
                const newSheet = doc.sheetsByIndex[0];
                const newRows = await newSheet.getRows();
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                setFavorites(storedFavorites);
                setSheet(newSheet);
                setRows(newRows);
                setLoaded(true);
            }
            catch (err) {
                setLoaded(false);
            }
        }

        fetch();
    }, []);

    // parses google sheets doc
    useEffect(() => {
        if (sheet === null || rows === undefined) return;
        setTemplates({});
        for (let i = 0; i <= sheet.rowCount; i++) {
            const row = rows[i];
            if (row === undefined) continue;
            setTemplates(prevTemplates => ({
                ...prevTemplates,
                [row.get('category')]: [
                    ...(prevTemplates[row.get('category')] || []),
                    {
                        name: row.get('name'),
                        body: row.get('body')
                    }
                ]
            }));
        }
    }, [sheet, rows]);

    useEffect(() => {
        localStorage.setItem('templates', JSON.stringify(templates));
    }, [templates]);

    const setNewFavorite = (name, body) => {
        if (favorites.some(favorite => favorite.name === name)) return;
        const newFavorite = { name: name, body: body };
        const newFavorites = [...favorites, newFavorite];

        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        setFavorites(newFavorites);
    }

    const removeFavorite = (name) => {
        const updatedFavorites = favorites.filter(favorite => favorite.name !== name);

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    }

    return (
        <div>
            <div className="email-templates-title">
                <h1 className="email-templates-title">Email templates</h1>
            </div>
            {
                loaded === undefined && (
                    <div className="awaiting-container">
                        <p>(づ ◕‿◕ )づ</p>
                        <p>Loading...</p>
                    </div>
                )
            }
            {
                loaded === false && (
                    <div className="awaiting-container">
                        <p>(ง •̀_•́)ง</p>
                        <p>Error loading templates from Google Sheets.  Message Indy on Slack.</p>
                    </div>
                )
            }
            {
                loaded === true && (
                    <div>
                        <div>
                            <ExpandableItem itemName="Favorites" expandedDefault={favorites.length !== 0}>
                                {
                                    favorites.length !== 0 ? favorites.map((template, index) => 
                                        <EmailTemplate key={index} name={template.name} body={template.body} favorite={true} unfavorite={removeFavorite}/>
                                    ) : (
                                        <div className="awaiting-container">
                                            <p>(ᴗ_ ᴗ。)</p>
                                            <p>You don't have any favorites.</p>
                                        </div>
                                    )
                                }
                            </ExpandableItem>
                        </div>
                        {
                            Object.keys(templates).map(category =>
                                <div key={category}>
                                    <ExpandableItem itemName={category}>
                                        {
                                            templates[category].map((template, index) => 
                                                <EmailTemplate key={index} name={template.name} body={template.body} favorite={setNewFavorite}/>
                                            )
                                        }
                                    </ExpandableItem>
                                </div> 
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}