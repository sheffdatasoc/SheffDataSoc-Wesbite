# 🐳 Docker Deployment Guide

Complete guide to running SheffDataSoc website with Docker.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- `.env` and `.env.local` files configured

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│  Frontend Container (Port 3000) │
│  - React App (Dev) or           │
│  - Nginx + Built App (Prod)     │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Backend Container (Port 3001)  │
│  - Node.js Sync Service         │
│  - Runs hourly Notion sync      │
└─────────────────────────────────┘
              ↓
        ┌──────────────┐
        │   SUPABASE   │
        │  (External)  │
        └──────────────┘
```

## 🚀 Quick Start

### Development Mode (Hot Reload)

```bash
# Using npm scripts
npm run docker:dev

# Or directly
docker-compose -f docker-compose.dev.yml up --build
```

Visit: http://localhost:3000

### Production Mode

```bash
# Using npm scripts
npm run docker:prod

# Or directly
docker-compose up --build
```

Visit: http://localhost:3000

## 📝 Available Commands

### NPM Scripts (Recommended)

```bash
npm run docker:dev              # Start development
npm run docker:dev:detached     # Start dev in background
npm run docker:prod             # Start production
npm run docker:prod:detached    # Start prod in background
npm run docker:stop             # Stop all containers
npm run docker:logs             # View logs
npm run docker:clean            # Clean up everything
```

### Direct Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up --build
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f frontend
docker-compose logs -f backend

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Stop and remove everything
docker-compose down -v
docker system prune -af
```

## 🔧 Configuration

### Environment Variables

Both compose files read from:
- `.env` - Backend variables
- `.env.local` - Frontend variables (for dev mode)

**Development** uses environment variables directly.
**Production** bakes them into the build.

### Ports

- **Frontend**: `3000` → `80` (production) or `3000` (development)
- **Backend**: `3001` → `3001`

To change ports, edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Use port 8080 instead of 3000
```

## 🏗️ Container Details

### Frontend Container (Development)

- **Base Image**: `node:18-alpine`
- **Features**:
  - Hot reload enabled
  - Source code mounted as volume
  - Changes reflect instantly
  - No build step needed

### Frontend Container (Production)

- **Base Image**: `node:18-alpine` (build) → `nginx:alpine` (serve)
- **Features**:
  - Multi-stage build
  - Optimized React build
  - Nginx web server
  - Compressed assets
  - Health checks

### Backend Container

- **Base Image**: `node:18-alpine`
- **Features**:
  - Notion sync service
  - Runs on schedule (hourly)
  - Manual sync endpoint: `POST http://localhost:3001/sync`
  - Health check endpoint: `GET http://localhost:3001/health`

## 🔍 Debugging

### View Container Logs

```bash
# All logs
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 frontend
```

### Enter Container Shell

```bash
# Frontend
docker-compose exec frontend sh

# Backend
docker-compose exec backend sh
```

### Check Container Status

```bash
# List running containers
docker-compose ps

# Check health
docker ps
```

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Changes Not Reflecting (Dev Mode)

```bash
# Restart frontend container
docker-compose restart frontend

# Or rebuild
docker-compose up --build frontend
```

### Backend Sync Not Working

```bash
# Check backend logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep NOTION
docker-compose exec backend env | grep SUPABASE

# Trigger manual sync
curl -X POST http://localhost:3001/sync
```

### Database Connection Issues

```bash
# Test from backend container
docker-compose exec backend sh
node -e "console.log(process.env.SUPABASE_URL)"

# Check if backend can reach Supabase
docker-compose exec backend wget -O- $SUPABASE_URL
```

## 🚢 Deployment

### Deploy to Production Server

```bash
# 1. Copy files to server
scp -r . user@server:/path/to/app

# 2. SSH into server
ssh user@server

# 3. Navigate to app directory
cd /path/to/app

# 4. Create .env files with production credentials
nano .env
nano .env.local

# 5. Start with Docker Compose
docker-compose up -d

# 6. Check logs
docker-compose logs -f
```

### Deploy with Docker Hub

```bash
# 1. Build and tag images
docker build -t sheffdatasoc/frontend:latest -f docker/Dockerfile .
docker build -t sheffdatasoc/backend:latest -f docker/Dockerfile.backend .

# 2. Push to Docker Hub
docker push sheffdatasoc/frontend:latest
docker push sheffdatasoc/backend:latest

# 3. On production server, pull and run
docker pull sheffdatasoc/frontend:latest
docker pull sheffdatasoc/backend:latest
docker-compose up -d
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use secrets management** - For production, use Docker secrets or vault
3. **Regular updates** - Keep base images updated
4. **Minimal images** - Use Alpine Linux for smaller attack surface
5. **Health checks** - Already configured in compose files
6. **Read-only containers** - Consider adding for production

## 📊 Performance Optimization

### Production Build

The production build is already optimized:
- ✅ Multi-stage build (smaller image)
- ✅ Nginx serving static files
- ✅ Gzip compression enabled
- ✅ Cache headers configured
- ✅ Only production dependencies

### Additional Optimizations

```yaml
# docker-compose.yml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker.yml`:

```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build images
        run: docker-compose build
      - name: Run tests
        run: docker-compose run frontend npm test
```

## 📈 Monitoring

### Container Stats

```bash
# Live stats
docker stats

# One-time stats
docker stats --no-stream
```

### Logs to File

```bash
# Save logs
docker-compose logs > logs.txt

# Tail and save
docker-compose logs -f > logs.txt
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes too (DATABASE DATA WILL BE LOST)
docker-compose down -v

# Clean up all Docker resources
docker system prune -af --volumes

# Remove specific images
docker rmi sheffdatasoc-frontend
docker rmi sheffdatasoc-backend
```

## ❓ FAQ

**Q: Can I run only frontend or backend?**
```bash
docker-compose up frontend
docker-compose up backend
```

**Q: How do I update environment variables?**
1. Edit `.env` or `.env.local`
2. Restart containers: `docker-compose restart`
3. For production build vars, rebuild: `docker-compose up --build`

**Q: Where is the data stored?**
All data is in Supabase (external). Containers are stateless.

**Q: Can I use this in production?**
Yes! The production compose file is production-ready.

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

Made with ❤️ by SheffDataSoc