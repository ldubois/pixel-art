<?php

namespace App\Tests\Service;

use App\Service\ArtLibraryService;
use PHPUnit\Framework\TestCase;

class ArtLibraryServiceTest extends TestCase
{
    private function getProjectDir(): string
    {
        return dirname(__DIR__, 2);
    }

    public function testGetArtList(): void
    {
        $service = new ArtLibraryService($this->getProjectDir());
        $list = $service->getArtList();

        $this->assertIsArray($list);
        $this->assertNotEmpty($list);
        $this->assertContains('mario', $list);
    }

    public function testGetArt(): void
    {
        $service = new ArtLibraryService($this->getProjectDir());
        $mario = $service->getArt('mario');

        $this->assertIsArray($mario);
        $this->assertCount(256, $mario); // 16x16 grid
    }
}

