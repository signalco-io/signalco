import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const textWidth = undefined;
        const textHeight = searchParams.get('textHeight') ? parseInt(searchParams.get('textHeight') ?? '') : undefined;
        const theme = searchParams.get('theme') ?? 'light';
        const width = searchParams.get('width') ? parseInt(searchParams.get('width') ?? '') : undefined;
        const height = searchParams.get('height') ? parseInt(searchParams.get('height') ?? '') : undefined;

        const paddingTop = textHeight ? Math.ceil(textHeight / 10.5) : Math.ceil((textWidth ?? 0) / 40);
        const fixedHeight = textHeight ?? (1255 / 1294) * ((textWidth ?? 0) + paddingTop * 4);
        const fixedWidth = textWidth ?? (1294 / 1255) * ((textHeight ?? 0) - paddingTop);

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        color: theme === 'dark' ? 'white' : 'black',
                        background: 'transparent',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <svg version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width={fixedWidth}
                        height={fixedHeight - paddingTop}
                        aria-label="Signalco"
                        role="img"
                        viewBox="0 0 1255.000000 1294.000000"
                        preserveAspectRatio="xMidYMid meet">
                        <g
                            style={{ fill: theme === 'dark' ? '#ffffff' : '#000000' }}
                            transform="translate(0.000000,1294.000000) scale(0.100000,-0.100000)"
                            stroke="none">
                            <path d="M5840 12593 c-565 -38 -1006 -105 -1485 -224 -1340 -335 -2560 -1010 -3566 -1973 -102 -98 -121 -121 -158 -196 -30 -61 -45 -107 -53 -166 -45 -311 204 -596 522 -596 158 0 274 55 425 201 1578 1519 3792 2186 5975 1800 1295 -229 2572 -878 3505 -1780 172 -167 280 -221 445 -221 141 0 273 55 370 153 73 73 115 147 140 243 38 151 21 256 -73 432 -26 47 -335 334 -572 530 -1288 1064 -2864 1685 -4550 1794 -141 9 -806 12 -925 3z" />
                            <path d="M5945 9194 c-903 -73 -1612 -312 -2295 -775 -769 -521 -1349 -1299 -1646 -2207 -274 -839 -307 -1843 -89 -2729 263 -1067 902 -1977 1820 -2590 370 -247 791 -436 1249 -562 888 -244 1962 -223 2818 54 861 279 1576 783 2098 1480 470 627 770 1362 869 2135 32 242 41 402 41 690 0 384 -26 673 -91 995 -120 604 -334 1115 -684 1640 -412 617 -931 1067 -1620 1407 -469 231 -950 371 -1510 439 -136 16 -243 21 -540 24 -203 1 -392 1 -420 -1z m865 -1072 c323 -49 565 -116 830 -229 223 -95 500 -254 698 -402 153 -114 433 -390 543 -536 403 -532 630 -1138 700 -1875 15 -161 15 -619 0 -780 -90 -935 -447 -1700 -1055 -2258 -470 -432 -1047 -692 -1746 -788 -179 -24 -637 -30 -840 -10 -667 64 -1211 270 -1690 642 -138 107 -396 361 -505 499 -523 655 -776 1468 -752 2415 9 340 42 605 113 892 231 941 807 1682 1635 2103 359 182 728 291 1161 340 189 21 730 14 908 -13z" />
                        </g>
                    </svg>
                </div>
            ),
            {
                width: width,
                height: height
            },
        );
    } catch {
        return new Response('Failed to generate the image', {
            status: 500,
        });
    }
}
