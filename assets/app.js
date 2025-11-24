import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

// Only log in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
}
