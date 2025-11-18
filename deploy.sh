#!/bin/bash

# MetaWorks Deployment Script
# This script helps you deploy your MetaWorks application to various platforms

set -e

echo "🚀 MetaWorks Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Requirements check passed!"
}

# Build the application
build_app() {
    print_status "Building MetaWorks application..."
    
    # Clean previous builds
    rm -rf dist/
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Build the application
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build completed successfully!"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    vercel --prod
    
    print_success "Deployed to Vercel successfully!"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build the app first
    build_app
    
    # Deploy to Netlify
    netlify deploy --prod --dir=dist/public
    
    print_success "Deployed to Netlify successfully!"
}

# Deploy using Docker
deploy_docker() {
    print_status "Deploying using Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Build the Docker image
    docker build -t metaworks .
    
    # Stop existing container if running
    docker stop metaworks-container 2>/dev/null || true
    docker rm metaworks-container 2>/dev/null || true
    
    # Run the new container
    docker run -d --name metaworks-container -p 5000:5000 metaworks
    
    print_success "Deployed using Docker successfully!"
    print_status "Your app is running at: http://localhost:5000"
}

# Deploy using docker-compose
deploy_docker_compose() {
    print_status "Deploying using Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build and start services
    docker-compose up -d --build
    
    print_success "Deployed using Docker Compose successfully!"
    print_status "Your app is running at: http://localhost:5000"
}

# Show deployment options
show_menu() {
    echo ""
    echo "Choose your deployment method:"
    echo "1) Deploy to Vercel (Recommended - Free hosting)"
    echo "2) Deploy to Netlify (Free hosting)"
    echo "3) Deploy using Docker (Local deployment)"
    echo "4) Deploy using Docker Compose (Local deployment with database)"
    echo "5) Just build the application"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            build_app
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            build_app
            deploy_docker
            ;;
        4)
            build_app
            deploy_docker_compose
            ;;
        5)
            build_app
            print_success "Application built successfully!"
            print_status "You can run it locally with: npm start"
            ;;
        6)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Main execution
main() {
    echo "Welcome to MetaWorks deployment!"
    echo ""
    
    check_requirements
    
    if [ "$1" = "--vercel" ]; then
        build_app
        deploy_vercel
    elif [ "$1" = "--netlify" ]; then
        deploy_netlify
    elif [ "$1" = "--docker" ]; then
        build_app
        deploy_docker
    elif [ "$1" = "--docker-compose" ]; then
        build_app
        deploy_docker_compose
    elif [ "$1" = "--build-only" ]; then
        build_app
    else
        show_menu
    fi
}

# Run main function with all arguments
main "$@"
