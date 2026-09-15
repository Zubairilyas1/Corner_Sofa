// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { alashiResponse } from '@/lib/alashi-provider';
const originalKey=process.env.OPENAI_API_KEY;
afterEach(()=>{vi.unstubAllGlobals();if(originalKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey;});
describe('ALASHI provider integration',()=>{
  it('fails clearly without credentials',async()=>{delete process.env.OPENAI_API_KEY;await expect(alashiResponse('JSON policy',[])).rejects.toThrow('not configured');});
  it('sends image/document inputs with storage disabled and parses text',async()=>{process.env.OPENAI_API_KEY='test-only';const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({output:[{type:'message',content:[{type:'output_text',text:'{"answer":"Hello"}'}]}]})));vi.stubGlobal('fetch',fetcher);const content=[{type:'input_image',image_url:'data:image/png;base64,eA=='},{type:'input_file',filename:'sofa.pdf',file_data:'data:application/pdf;base64,eA=='}];expect((await alashiResponse('Return JSON',content)).text).toContain('Hello');const sent=JSON.parse(fetcher.mock.calls[0][1].body);expect(sent.store).toBe(false);expect(sent.input[0].content).toEqual(content);expect(sent.tools).toBeUndefined();});
  it('requests the image tool explicitly and returns a downloadable image',async()=>{process.env.OPENAI_API_KEY='test-only';const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({output:[{type:'image_generation_call',result:'YWJj'}]})));vi.stubGlobal('fetch',fetcher);expect((await alashiResponse('Generate sofa',[],true)).image).toBe('data:image/png;base64,YWJj');expect(JSON.parse(fetcher.mock.calls[0][1].body).tool_choice).toEqual({type:'image_generation'});});
  it('does not expose upstream errors or secrets',async()=>{process.env.OPENAI_API_KEY='test-only';vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('private upstream details',{status:401})));await expect(alashiResponse('JSON',[])).rejects.toThrow('temporarily unavailable');});
});
