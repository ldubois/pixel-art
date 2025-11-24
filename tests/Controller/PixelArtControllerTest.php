<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PixelArtControllerTest extends WebTestCase
{
    public function testIndexPageRenders(): void
    {
        $client = static::createClient();
        // Force French locale for test consistency
        $crawler = $client->request('GET', '/?lang=fr');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('#grid-container');
    }
}
