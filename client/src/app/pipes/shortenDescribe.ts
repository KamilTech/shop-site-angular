import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'shorten'
})
export class SortenPipe implements PipeTransform {
    transform(value: any, args: number): any {
        let shorten = value;
        return shorten.substring(0, args);
    }
}