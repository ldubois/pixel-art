<?php

namespace App\Model;

abstract class AbstractPixelArtModel
{
    protected const WIDTH = 16;
    protected const HEIGHT = 16;
    protected const TOTAL_PIXELS = 256;

    protected string $name;
    protected array $pixels = [];

    public function __construct(string $name, array $pixelData)
    {
        $this->name = $name;
        $this->loadFromData($pixelData);
    }

    /**
     * Load pixel data from array format
     * Format: [["row" => int, "col" => int, "color" => string], ...]
     */
    protected function loadFromData(array $pixelData): void
    {
        // Initialize grid with white
        $this->pixels = array_fill(0, self::TOTAL_PIXELS, '#FFFFFF');

        foreach ($pixelData as $pixel) {
            if (!isset($pixel['row'], $pixel['col'], $pixel['color'])) {
                continue;
            }

            $row = (int) $pixel['row'];
            $col = (int) $pixel['col'];
            $color = (string) $pixel['color'];

            if ($row >= 0 && $row < self::HEIGHT && $col >= 0 && $col < self::WIDTH) {
                $index = $row * self::WIDTH + $col;
                $this->pixels[$index] = $color;
            }
        }
    }

    /**
     * Get pixel array (256 colors in linear format)
     */
    public function getPixels(): array
    {
        return $this->pixels;
    }

    /**
     * Get pixel at specific position
     */
    public function getPixel(int $row, int $col): string
    {
        if ($row < 0 || $row >= self::HEIGHT || $col < 0 || $col >= self::WIDTH) {
            return '#FFFFFF';
        }

        $index = $row * self::WIDTH + $col;
        return $this->pixels[$index] ?? '#FFFFFF';
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getWidth(): int
    {
        return self::WIDTH;
    }

    public function getHeight(): int
    {
        return self::HEIGHT;
    }

    /**
     * Convert to array format for JSON export
     */
    public function toArray(): array
    {
        $pixelData = [];
        for ($row = 0; $row < self::HEIGHT; $row++) {
            for ($col = 0; $col < self::WIDTH; $col++) {
                $index = $row * self::WIDTH + $col;
                $color = $this->pixels[$index];
                if ($color !== '#FFFFFF') { // Only store non-white pixels
                    $pixelData[] = [
                        'row' => $row,
                        'col' => $col,
                        'color' => $color,
                    ];
                }
            }
        }

        return [
            'name' => $this->name,
            'width' => self::WIDTH,
            'height' => self::HEIGHT,
            'pixels' => $pixelData,
        ];
    }

    /**
     * Create from JSON file
     */
    public static function fromJsonFile(string $filePath): self
    {
        if (!file_exists($filePath)) {
            throw new \RuntimeException("Pixel art file not found: {$filePath}");
        }

        $json = file_get_contents($filePath);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("Invalid JSON in file: {$filePath}");
        }

        if (!isset($data['name'], $data['pixels'])) {
            throw new \RuntimeException("Invalid pixel art format in file: {$filePath}");
        }

        return new static($data['name'], $data['pixels']);
    }
}

