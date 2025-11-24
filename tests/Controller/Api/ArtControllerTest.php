<?php

namespace App\Tests\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArtControllerTest extends WebTestCase
{
    public function testGetList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/art');

        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertContains('mario', $content);
    }

    public function testGetArtShow(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/art/mario');

        $this->assertResponseIsSuccessful();
        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($content);
        $this->assertCount(256, $content);
    }

    public function testGetArtNotFound(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/art/nonexistent');

        $this->assertResponseStatusCodeSame(404);
        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('error', $content);
        $this->assertEquals('Art not found', $content['error']);
    }
}

