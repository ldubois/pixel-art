<?php

namespace App\Controller\Api;

use App\Service\ArtLibraryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/art', name: 'api_art_')]
class ArtController extends AbstractController
{
    public function __construct(private ArtLibraryService $artLibrary)
    {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json($this->artLibrary->getArtList());
    }

    #[Route('/{name}', name: 'show', methods: ['GET'])]
    public function show(string $name): JsonResponse
    {
        // Validate name format to prevent path traversal attacks
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $name)) {
            return $this->json(['error' => 'Invalid art name'], 400);
        }
        
        // Validate that the art exists
        if (!$this->artLibrary->hasArt($name)) {
            return $this->json(['error' => 'Art not found'], 404);
        }
        
        return $this->json($this->artLibrary->getArt($name));
    }
}

