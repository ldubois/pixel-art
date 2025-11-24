<?php

namespace App\Service;

use App\Model\PixelArtModel;
use Psr\Log\LoggerInterface;

class ArtLibraryService
{
    private array $library = [];
    private string $pixelArtDir;

    public function __construct(string $projectDir, private LoggerInterface $logger)
    {
        $this->pixelArtDir = $projectDir . '/config/pixel_art';
        $this->loadArtLibrary();
    }

    /**
     * Load all pixel art models from JSON files
     */
    private function loadArtLibrary(): void
    {
        if (!is_dir($this->pixelArtDir)) {
            return;
        }

        $files = glob($this->pixelArtDir . '/*.json');
        
        foreach ($files as $file) {
            try {
                $model = PixelArtModel::fromJsonFile($file);
                $this->library[$model->getName()] = $model->getPixels();
            } catch (\Exception $e) {
                // Log error but continue loading other files
                $this->logger->error('Failed to load pixel art', [
                    'file' => $file,
                    'error' => $e->getMessage(),
                    'exception' => $e,
                ]);
            }
        }
    }

    /**
     * Get list of available art names
     */
    public function getArtList(): array
    {
        return array_keys($this->library);
    }

    /**
     * Get pixel art by name
     * Returns array of 256 colors (16x16 grid in linear format)
     */
    public function getArt(string $name): array
    {
        return $this->library[$name] ?? array_fill(0, 256, '#FFFFFF');
    }

    /**
     * Check if an art exists
     */
    public function hasArt(string $name): bool
    {
        return isset($this->library[$name]);
    }
}
