import { useState, useEffect } from 'react';

const EmailTemplate = ({ name, body, favorite, unfavorite }) => {
    const [buttonsShown, setButtonsShown] = useState(false);
    const [alertShown, setAlertShown] = useState(false);

    useEffect(() => {
        if (alertShown) {
            const timeout = setTimeout(() => {
                setAlertShown(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [alertShown]);

    // shoddy outdated conversion but hey it works
    const copyClicked = () => {
        const listener = (ev) => {
            ev.preventDefault();
            ev.clipboardData.setData('text/html', body);
            ev.clipboardData.setData('text/plain', body);
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);

        setAlertShown(true);
    }

    const favoriteClicked = () => {
        if (favorite === true) {
            unfavorite(name);
            return;
        }
        favorite(name, body);
    }

    const showButtons = (e) => {
        e.preventDefault();
        setAlertShown(false);
        setButtonsShown(!buttonsShown);
    }

    return (
        <div className="email-template" onMouseEnter={showButtons} onMouseLeave={showButtons}>
            <p className="email-template-name" title={"Copy " + name} onClick={copyClicked} >{ name }</p>
            {
                buttonsShown ?
                    <>
                        <button onClick={copyClicked} className="email-template-button" title="Copy">
                            {
                                alertShown ?
                                    <>
                                        <div className="email-template-alert">
                                            <p>Copied!</p>
                                        </div>
                                    </>
                                : <></>
                            }
                            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M9 9V6.2002C9 5.08009 9 4.51962 9.21799 4.0918C9.40973 3.71547 9.71547 3.40973 10.0918 3.21799C10.5196 3 11.0801 3 12.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21.0002 4.51962 21.0002 5.07967 21.0002 6.19978V11.7998C21.0002 12.9199 21.0002 13.48 20.7822 13.9078C20.5905 14.2841 20.2839 14.5905 19.9076 14.7822C19.4802 15 18.921 15 17.8031 15H15M9 9H6.2002C5.08009 9 4.51962 9 4.0918 9.21799C3.71547 9.40973 3.40973 9.71547 3.21799 10.0918C3 10.5196 3 11.0801 3 12.2002V17.8002C3 18.9203 3 19.4801 3.21799 19.9079C3.40973 20.2842 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H11.8036C12.9215 21 13.4805 21 13.9079 20.7822C14.2842 20.5905 14.5905 20.2839 14.7822 19.9076C15 19.4802 15 18.921 15 17.8031V15M9 9H11.8002C12.9203 9 13.4801 9 13.9079 9.21799C14.2842 9.40973 14.5905 9.71547 14.7822 10.0918C15 10.5192 15 11.079 15 12.1969L15 15" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                            </svg>
                        </button>
                        <button className="email-template-button" onClick={favoriteClicked} title="Favorite">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill={favorite === true ? "#FFD700" : "none"} xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke={favorite === true ? "#FFD700" : "#FFFFFF"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </>
                : <></>
            }
        </div>
    )
}

export default EmailTemplate;