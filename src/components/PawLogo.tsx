import React from 'react';

interface PawLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'badge';
}

/**
 * PAWdiCURE Brand Logo
 * Accurately replicates the official uploaded logo badge:
 * "PAW CARE EXPERTS" arc + Loving pet owners with Dog & Cat + Terracotta Paw & Care Cross + "PAW di CURE PROFESSIONAL"
 */
export function PawLogo({ className = 'w-8 h-8', variant = 'full' }: PawLogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded badge border */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill="#FFF9F5"
          stroke="#C25E3E"
          strokeWidth="3.5"
        />
        {/* Central Paw Pad with Leaf / Cross element */}
        <path
          d="M32 64 C28 50 36 38 48 38 C56 38 64 45 68 54 C72 64 64 74 50 74 C38 74 34 70 32 64 Z"
          fill="#C25E3E"
        />
        {/* Inner botanical leaf incision */}
        <path
          d="M48 44 C44 52 46 62 50 68 C54 62 58 54 54 46 C52 42 50 42 48 44 Z"
          fill="#FCEADE"
        />
        {/* Paw Toes */}
        <ellipse cx="28" cy="36" rx="7" ry="10" transform="rotate(-20 28 36)" fill="#C25E3E" />
        <ellipse cx="43" cy="26" rx="7.5" ry="11" transform="rotate(-6 43 26)" fill="#C25E3E" />
        <ellipse cx="59" cy="26" rx="7.5" ry="11" transform="rotate(6 59 26)" fill="#C25E3E" />
        <ellipse cx="74" cy="36" rx="7" ry="10" transform="rotate(20 74 36)" fill="#C25E3E" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Rounded Badge */}
      <rect
        x="6"
        y="6"
        width="228"
        height="228"
        rx="46"
        fill="#FAF3EC"
        stroke="#2D3139"
        strokeWidth="6.5"
      />
      
      {/* Subtle Inner Framing Lines */}
      <rect
        x="15"
        y="15"
        width="210"
        height="210"
        rx="38"
        fill="#FCF7F2"
        stroke="#E8D8CC"
        strokeWidth="1.5"
      />

      {/* Top Banner Text: PAW CARE EXPERTS */}
      <g>
        <path
          d="M17 38 L23 44 M223 38 L217 44"
          stroke="#C25E3E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Star sparkles */}
        <polygon points="34,42 36,46 40,48 36,50 34,54 32,50 28,48 32,46" fill="#D47B5A" />
        <polygon points="206,42 208,46 212,48 208,50 206,54 204,50 200,48 204,46" fill="#D47B5A" />
        
        <text
          x="120"
          y="46"
          textAnchor="middle"
          fill="#2C3440"
          fontSize="11.5"
          fontWeight="900"
          fontFamily="'Outfit', sans-serif"
          letterSpacing="1.8"
        >
          PAW CARE EXPERTS
        </text>
      </g>

      {/* Center Group: Paw + Cross + Male Owner & Dog + Female Owner & Cat */}
      <g transform="translate(0, 8)">
        {/* Male Owner on Left */}
        <g id="owner-male" opacity="0.95">
          {/* Head & Hair */}
          <circle cx="48" cy="62" r="7.5" fill="#C48464" />
          <path d="M42 58 C44 54 53 53 56 57 C53 55 45 56 42 58 Z" fill="#2E333D" />
          {/* Orange Shirt */}
          <path
            d="M39 72 C41 68 55 68 57 72 L62 98 L34 98 Z"
            fill="#CE653E"
          />
          {/* Dark Trousers */}
          <path d="M36 98 L45 138 L49 138 L51 106 L53 138 L58 138 L62 98 Z" fill="#3D4550" />
        </g>

        {/* Golden Companion Dog (sitting next to male owner) */}
        <g id="companion-dog">
          <ellipse cx="64" cy="120" rx="10" ry="14" fill="#C98858" />
          {/* Dog Head */}
          <circle cx="70" cy="106" r="7.5" fill="#DFA06F" />
          {/* Snout */}
          <path d="M72 105 C76 106 79 108 77 111 C74 112 72 110 72 105 Z" fill="#C98858" />
          {/* Floppy Ear */}
          <path d="M66 102 C63 106 63 113 67 112 Z" fill="#9C5A30" />
          {/* Tail */}
          <path d="M53 124 C46 126 44 133 48 134 C52 135 55 129 55 125 Z" fill="#C98858" />
        </g>

        {/* Central Paw Icon & Clinical Cross Symbol */}
        <g id="central-paw-cross">
          {/* Paw Base / Cross */}
          <path
            d="M102 122 C90 120 84 106 91 92 C95 84 105 80 114 84 C116 85 119 85 121 84 C129 80 140 84 144 92 C150 106 142 122 124 122 Z"
            fill="#B85532"
            stroke="#87351A"
            strokeWidth="1.5"
          />
          
          {/* Medical Clinical Cross Extension on Right */}
          <path
            d="M136 84 L152 84 L152 94 L160 94 L160 106 L152 106 L152 116 L136 116 Z"
            fill="#A34424"
          />

          {/* Botanical / Leaf Centerpiece in Paw */}
          <path
            d="M117 86 C110 96 113 108 120 116 C126 108 130 96 124 88 C121 84 119 84 117 86 Z"
            fill="#F7D8C5"
          />
          {/* Leaf vein */}
          <line x1="120" y1="88" x2="120" y2="114" stroke="#B85532" strokeWidth="1" />

          {/* Paw Toes */}
          <ellipse cx="86" cy="74" rx="9" ry="13" transform="rotate(-20 86 74)" fill="#B85532" stroke="#87351A" strokeWidth="1.2" />
          <ellipse cx="107" cy="62" rx="9.5" ry="14" transform="rotate(-6 107 62)" fill="#B85532" stroke="#87351A" strokeWidth="1.2" />
          <ellipse cx="133" cy="62" rx="9.5" ry="14" transform="rotate(6 133 62)" fill="#B85532" stroke="#87351A" strokeWidth="1.2" />
        </g>

        {/* Female Owner on Right */}
        <g id="owner-female" opacity="0.95">
          {/* Head & Long Hair */}
          <circle cx="192" cy="63" r="7.5" fill="#DF9C7D" />
          <path d="M184 60 C186 54 198 54 200 62 C201 70 197 76 195 80 C193 74 186 70 184 60 Z" fill="#242933" />
          {/* Green Blouse */}
          <path
            d="M183 73 C186 69 198 69 201 73 L205 97 L179 97 Z"
            fill="#477359"
          />
          {/* Trousers */}
          <path d="M181 97 L186 138 L191 138 L193 104 L195 138 L200 138 L204 97 Z" fill="#4B4E58" />
        </g>

        {/* Siamese / Tuxedo Cat sitting next to female owner */}
        <g id="companion-cat">
          <ellipse cx="176" cy="122" rx="7.5" ry="11" fill="#E8E2DA" />
          {/* Cat Head */}
          <circle cx="174" cy="111" r="6" fill="#EDE7DF" />
          {/* Ears */}
          <polygon points="170,107 172,102 174,106" fill="#5A4740" />
          <polygon points="176,106 178,102 180,107" fill="#5A4740" />
          {/* Mask */}
          <ellipse cx="174" cy="112" rx="4" ry="3" fill="#5A4740" />
          {/* Tail */}
          <path d="M182 126 C190 125 194 133 189 137 C185 138 181 133 182 126 Z" fill="#3D3430" />
        </g>
      </g>

      {/* Bottom Brand Typography: PAW di CURE PROFESSIONAL */}
      <g transform="translate(0, -6)">
        {/* "PAW" in bold dark typography */}
        <text
          x="62"
          y="188"
          fill="#222B38"
          fontSize="31"
          fontWeight="900"
          fontFamily="'Outfit', sans-serif"
          letterSpacing="0.5"
        >
          PAW
        </text>

        {/* "di" in italic script style */}
        <text
          x="132"
          y="174"
          fill="#B85532"
          fontSize="22"
          fontStyle="italic"
          fontWeight="700"
          fontFamily="Georgia, serif"
        >
          di
        </text>

        {/* "CURE" in terracotta serif typography */}
        <text
          x="126"
          y="198"
          fill="#B85532"
          fontSize="28"
          fontWeight="900"
          fontFamily="Georgia, serif"
          letterSpacing="0.8"
        >
          CURE
        </text>

        {/* Subtitle: PROFESSIONAL */}
        <text
          x="62"
          y="203"
          fill="#485363"
          fontSize="9"
          fontWeight="800"
          fontFamily="'Outfit', sans-serif"
          letterSpacing="2.2"
        >
          PROFESSIONAL
        </text>
      </g>
    </svg>
  );
}
