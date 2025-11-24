<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    private array $allowedLocales = ['fr', 'en', 'es'];
    private string $defaultLocale = 'fr';

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        
        // Try to get locale from query parameter
        $locale = $request->query->get('lang');
        
        // If not in query, try to get from session
        if (!$locale) {
            $session = $request->hasSession() ? $request->getSession() : null;
            if ($session) {
                $locale = $session->get('_locale');
            }
        }
        
        // If still no locale, use request locale or default
        if (!$locale || !in_array($locale, $this->allowedLocales, true)) {
            $locale = $request->getLocale() ?: $this->defaultLocale;
        }
        
        // Validate locale
        if (!in_array($locale, $this->allowedLocales, true)) {
            $locale = $this->defaultLocale;
        }
        
        // Set locale on request
        $request->setLocale($locale);
        
        // Persist locale in session
        if ($request->hasSession()) {
            $request->getSession()->set('_locale', $locale);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}

