import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { SVG_ICONS } from './fashion-icon.model';
import { FashionIconRegistry } from './fashion-icon-registry';

export const svgIconsProviders = [
    {
        provide: SVG_ICONS,
        useValue: {
            name: 'placeholder',
            svgSource: ''
        },
        multi: true
    },
];

@NgModule({
    imports: [
        HttpClientModule,
        MatIconModule
    ],
    exports: [
        MatIconModule
    ]
})
export class FashionIconModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: FashionIconModule,
            providers: [
                svgIconsProviders,
                { provide: MatIconRegistry, useClass: FashionIconRegistry }
            ]
        };
    }

}
