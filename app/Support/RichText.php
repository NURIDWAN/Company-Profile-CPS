<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

final class RichText
{
    private const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'];

    public static function sanitize(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        if (! class_exists(DOMDocument::class)) {
            return e(strip_tags($html));
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8"><div>'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $root = $document->getElementsByTagName('div')->item(0);
        if (! $root) {
            return e(strip_tags($html));
        }

        self::cleanChildren($root);

        $result = '';
        foreach ($root->childNodes as $child) {
            $result .= $document->saveHTML($child);
        }

        return $result !== '' ? $result : null;
    }

    private static function cleanChildren(DOMNode $parent): void
    {
        for ($index = $parent->childNodes->length - 1; $index >= 0; $index--) {
            $node = $parent->childNodes->item($index);
            if (! $node) {
                continue;
            }

            if ($node instanceof DOMElement) {
                $tag = strtolower($node->tagName);
                if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                    $parent->removeChild($node);
                    continue;
                }

                for ($attributeIndex = $node->attributes->length - 1; $attributeIndex >= 0; $attributeIndex--) {
                    $attribute = $node->attributes->item($attributeIndex);
                    if (! $attribute) {
                        continue;
                    }

                    if ($tag !== 'a' || $attribute->name !== 'href' || ! preg_match('/^https?:\/\//i', $attribute->value)) {
                        $node->removeAttribute($attribute->name);
                    }
                }
            }

            self::cleanChildren($node);
        }
    }
}
