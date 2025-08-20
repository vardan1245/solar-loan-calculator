#!/bin/bash

echo "🚀 Tiamat Loan Calculator - Vercel Deployment Script"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI found"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

echo ""
echo "📋 Setting up environment variables..."

# Create .env.local file for Vercel
cat > .env.local << EOF
SUPABASE_URL=https://ylmcwkabyqvgdrbnunri.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTI3MjMsImV4cCI6MjA2MjUyODcyM30.UrsOv_NmOJilHeQu9-brBI_1N7PYbOCYHsqc4cy6YqY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njk1MjcyMywiZXhwIjoyMDYyNTI4NzIzfQ.phjhAO435BbSF2nrIT5D1vSqrb9f99daSCwwKDsST1g
DATABASE_URL=postgresql://postgres:Gordzara!12@db.ylmcwkabyqvgdrbnunri.supabase.co:5432/postgres
EOF

echo "✅ Environment variables file created"

echo ""
echo "🚀 Deploying to Vercel..."
echo "When prompted:"
echo "  - Choose 'Other' for framework"
echo "  - Set output directory to 'public'"
echo "  - Leave build command empty"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "Your app should now be live at the URL shown above"
echo ""
echo "📝 Next steps:"
echo "1. Test your app at the deployed URL"
echo "2. Check that authentication works"
echo "3. Verify database connections"
echo ""
echo "🔧 If you need to update environment variables later:"
echo "   vercel env add SUPABASE_URL"
echo "   vercel env add SUPABASE_ANON_KEY"
echo "   vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "   vercel env add DATABASE_URL"
