<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PixelArtController extends AbstractController
{
    #[Route('/', name: 'app_pixel_art')]
    public function index(Request $request): Response
    {
        // Locale is handled by LocaleSubscriber
        return $this->render('pixel_art/index.html.twig', [
            'current_locale' => $request->getLocale(),
        ]);
    }
}
