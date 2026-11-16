import type { SVGProps } from 'react';
import fireflyMark from '../../../images/lumi-firefly.png';

export default function FireflyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}>
            <image href={fireflyMark} width="32" height="32" preserveAspectRatio="xMidYMid meet" />
        </svg>
    );
}
