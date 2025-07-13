import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResolveShortUrl = () => {
    const { shortUrl } = useParams(); // Capture the 'short_url' from the path
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const resolveShortUrl = async () => {
            try {
                const response = await fetch(`https://comp539-team2-backend-dot-rice-comp-539-spring-2022.uk.r.appspot.com/api/resolve/${shortUrl}`);
                const data = await response.json();

                if (response.ok) {
                    // Redirect to the original URL
                    window.location.href = data.data;
                } else {
                    // Handle any errors, like if the short URL doesn't exist
                    setError(data.message || 'Failed to resolve short URL.');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error resolving short URL:', err);
                setError('An unexpected error occurred.');
                setIsLoading(false);
            }
        };

        if (shortUrl) {
            resolveShortUrl();
        }
    }, [shortUrl]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    if (error) {
        // return <div>Error: {error}</div>;
        window.location.href = "https://snaplink.surge.sh/";
    }


    // If not loading and no error, redirecting will have been triggered
    return null;
};

export default ResolveShortUrl;
