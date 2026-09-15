// @vitest-environment node
import {afterAll,beforeAll,describe,it,expect} from 'vitest';
import {mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import {saveProductPhoto,readProductPhoto} from '@/lib/product-photo-store';
import {readSofaImage} from '@/lib/sofa-image-source';
import {POST} from '@/app/api/product-images/route';
import {NextRequest} from 'next/server';
let directory:string;const old=process.env.PRODUCT_DATA_DIR;
beforeAll(async()=>{directory=await mkdtemp(path.join(os.tmpdir(),'product-photo-test-'));process.env.PRODUCT_DATA_DIR=directory;});
afterAll(async()=>{if(old===undefined)delete process.env.PRODUCT_DATA_DIR;else process.env.PRODUCT_DATA_DIR=old;await rm(directory,{recursive:true,force:true});});
describe('uploaded product photos',()=>{
it('saves a real image, serves it and makes it available to colour generation',async()=>{const png=await sharp({create:{width:8,height:6,channels:3,background:'#c5b29c'}}).png().toBuffer();const url=await saveProductPhoto(png);const saved=await readProductPhoto(url.split('/').pop()!);expect((await sharp(saved).metadata()).format).toBe('webp');expect(await readSofaImage(url)).toEqual(saved);});
it('rejects non-images and path traversal',async()=>{await expect(saveProductPhoto(Buffer.from('not an image'))).rejects.toThrow();expect(await readProductPhoto('../secret')).toBeUndefined();});
it('requires a signed admin session for uploads',async()=>{expect((await POST(new NextRequest('http://localhost/api/product-images/',{method:'POST',body:'bad'}))).status).toBe(401);});
});
