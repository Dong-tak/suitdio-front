'use client'; // NextJS 13 requires this. Remove if you are using NextJS 12 or lower
import { useEffect } from 'react';
import Script from 'next/script';

const YourComponent = () => {
  useEffect(() => {
    const win = window as any;
    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }

    win.Featurebase('init_changelog_widget', {
      organization: 'suitdio', // Replace this with your organization name, copy-paste the subdomain part from your Featurebase workspace url (e.g. https://*yourorg*.featurebase.app)
      dropdown: {
        enabled: true, // Add this to enable the dropdown view of the changelog
        placement: 'right', // Add this to change the placement of the dropdown
      },
      popup: {
        enabled: true, // Add this to enable the popup view of the changelog
        usersName: 'John', // This will show the user's name in the popup as a greeting
        autoOpenForNewUpdates: true, // This will open the popup for new updates
      },
      theme: 'light', // Choose between dark or light theme
      locale: 'en', // Change the language, view all available languages from https://help.featurebase.app/en/articles/8879098-using-featurebase-in-my-language
    });
  }, []);

  return (
    <>
      <Script src='https://do.featurebase.app/js/sdk.js' id='featurebase-sdk' />
      <div className='mt-72'>
        <button data-featurebase-changelog>
          Open changelog <span id='fb-update-badge'></span>
        </button>
      </div>
    </>
  );
};

export default YourComponent;
