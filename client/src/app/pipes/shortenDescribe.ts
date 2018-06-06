import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'shorten'
})
export class SortenPipe implements PipeTransform {
    transform(value: any, args: number, body: boolean = false): any {
        const shorten = value;
        if (body) {
            return shorten.substring(args);
        } else {
            return shorten.substring(0, args);
        }
    }
}
