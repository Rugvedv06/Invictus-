-- ============================================
-- PCB INVENTORY MANAGEMENT SYSTEM
-- Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS AND AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- COMPONENT INVENTORY
-- ============================================

CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    current_stock_quantity INTEGER NOT NULL DEFAULT 0,
    monthly_required_quantity INTEGER NOT NULL DEFAULT 0,
    unit_of_measurement VARCHAR(50) DEFAULT 'pcs',
    reorder_threshold NUMERIC(10, 2),
    is_low_stock BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    CONSTRAINT positive_stock CHECK (current_stock_quantity >= 0)
);

CREATE INDEX idx_components_part_number ON components(part_number);
CREATE INDEX idx_components_low_stock ON components(is_low_stock);
CREATE INDEX idx_components_name ON components(component_name);

-- ============================================
-- PCB DEFINITIONS
-- ============================================

CREATE TABLE pcbs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pcb_name VARCHAR(255) NOT NULL,
    pcb_code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    version VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_pcbs_code ON pcbs(pcb_code);
CREATE INDEX idx_pcbs_active ON pcbs(is_active);

-- ============================================
-- PCB-COMPONENT MAPPING (BOM - Bill of Materials)
-- ============================================

CREATE TABLE pcb_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pcb_id UUID NOT NULL REFERENCES pcbs(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
    quantity_per_pcb INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_quantity CHECK (quantity_per_pcb > 0),
    CONSTRAINT unique_pcb_component UNIQUE(pcb_id, component_id)
);

CREATE INDEX idx_pcb_components_pcb ON pcb_components(pcb_id);
CREATE INDEX idx_pcb_components_component ON pcb_components(component_id);

-- ============================================
-- PCB PRODUCTION ENTRIES
-- ============================================

CREATE TABLE pcb_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pcb_id UUID NOT NULL REFERENCES pcbs(id),
    quantity_produced INTEGER NOT NULL,
    production_date DATE NOT NULL DEFAULT CURRENT_DATE,
    batch_number VARCHAR(100),
    dc_number VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    CONSTRAINT positive_production CHECK (quantity_produced > 0)
);

CREATE INDEX idx_production_pcb ON pcb_production(pcb_id);
CREATE INDEX idx_production_date ON pcb_production(production_date);
CREATE INDEX idx_production_batch ON pcb_production(batch_number);
CREATE INDEX idx_production_status ON pcb_production(status);

-- ============================================
-- COMPONENT CONSUMPTION HISTORY
-- ============================================

CREATE TABLE component_consumption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_id UUID NOT NULL REFERENCES components(id),
    pcb_production_id UUID REFERENCES pcb_production(id) ON DELETE SET NULL,
    quantity_consumed INTEGER NOT NULL,
    consumption_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(50) DEFAULT 'production', -- production, adjustment, return
    notes TEXT,
    created_by UUID REFERENCES users(id),
    CONSTRAINT positive_consumption CHECK (quantity_consumed > 0)
);

CREATE INDEX idx_consumption_component ON component_consumption(component_id);
CREATE INDEX idx_consumption_production ON component_consumption(pcb_production_id);
CREATE INDEX idx_consumption_date ON component_consumption(consumption_date);
CREATE INDEX idx_consumption_type ON component_consumption(transaction_type);

-- ============================================
-- PROCUREMENT TRIGGERS
-- ============================================

CREATE TABLE procurement_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_id UUID NOT NULL REFERENCES components(id),
    trigger_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_stock INTEGER NOT NULL,
    required_quantity INTEGER NOT NULL,
    threshold_percentage NUMERIC(5, 2) DEFAULT 20.00,
    status VARCHAR(50) DEFAULT 'pending', -- pending, ordered, received, cancelled
    notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_procurement_component ON procurement_triggers(component_id);
CREATE INDEX idx_procurement_status ON procurement_triggers(status);
CREATE INDEX idx_procurement_date ON procurement_triggers(trigger_date);

-- ============================================
-- STOCK ADJUSTMENTS (Manual adjustments)
-- ============================================

CREATE TABLE stock_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_id UUID NOT NULL REFERENCES components(id),
    adjustment_type VARCHAR(50) NOT NULL, -- addition, deduction, correction
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT,
    adjustment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_adjustments_component ON stock_adjustments(component_id);
CREATE INDEX idx_adjustments_date ON stock_adjustments(adjustment_date);
CREATE INDEX idx_adjustments_type ON stock_adjustments(adjustment_type);

-- ============================================
-- EXCEL IMPORT LOGS
-- ============================================

CREATE TABLE import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    import_type VARCHAR(50) NOT NULL, -- components, pcb_production, etc.
    records_imported INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    error_details TEXT,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imported_by UUID REFERENCES users(id)
);

CREATE INDEX idx_import_logs_date ON import_logs(imported_at);
CREATE INDEX idx_import_logs_type ON import_logs(import_type);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pcbs_updated_at BEFORE UPDATE ON pcbs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pcb_components_updated_at BEFORE UPDATE ON pcb_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check and update low stock status
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate if component is low stock (< 20% of monthly requirement)
    IF NEW.monthly_required_quantity > 0 THEN
        NEW.is_low_stock := (NEW.current_stock_quantity < (NEW.monthly_required_quantity * 0.2));
        
        -- Create procurement trigger if stock is low and wasn't low before
        IF NEW.is_low_stock = true AND (OLD IS NULL OR OLD.is_low_stock = false) THEN
            INSERT INTO procurement_triggers (
                component_id,
                current_stock,
                required_quantity,
                threshold_percentage,
                status
            ) VALUES (
                NEW.id,
                NEW.current_stock_quantity,
                NEW.monthly_required_quantity,
                20.00,
                'pending'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply low stock check trigger
CREATE TRIGGER check_component_low_stock BEFORE INSERT OR UPDATE ON components
    FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- Function to deduct component stock on PCB production
CREATE OR REPLACE FUNCTION deduct_component_stock()
RETURNS TRIGGER AS $$
DECLARE
    component_record RECORD;
    total_quantity INTEGER;
BEGIN
    -- Loop through all components for this PCB
    FOR component_record IN
        SELECT pc.component_id, pc.quantity_per_pcb, c.current_stock_quantity, c.component_name
        FROM pcb_components pc
        JOIN components c ON pc.component_id = c.id
        WHERE pc.pcb_id = NEW.pcb_id
    LOOP
        total_quantity := component_record.quantity_per_pcb * NEW.quantity_produced;
        
        -- Check if sufficient stock is available
        IF component_record.current_stock_quantity < total_quantity THEN
            RAISE EXCEPTION 'Insufficient stock for component %. Required: %, Available: %',
                component_record.component_name,
                total_quantity,
                component_record.current_stock_quantity;
        END IF;
        
        -- Deduct stock
        UPDATE components
        SET current_stock_quantity = current_stock_quantity - total_quantity
        WHERE id = component_record.component_id;
        
        -- Record consumption
        INSERT INTO component_consumption (
            component_id,
            pcb_production_id,
            quantity_consumed,
            transaction_type,
            consumption_date
        ) VALUES (
            component_record.component_id,
            NEW.id,
            total_quantity,
            'production',
            CURRENT_TIMESTAMP
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply stock deduction trigger
CREATE TRIGGER deduct_stock_on_production AFTER INSERT ON pcb_production
    FOR EACH ROW EXECUTE FUNCTION deduct_component_stock();

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View: Component-wise consumption summary
CREATE OR REPLACE VIEW v_component_consumption_summary AS
SELECT 
    c.id,
    c.component_name,
    c.part_number,
    c.current_stock_quantity,
    c.monthly_required_quantity,
    COALESCE(SUM(cc.quantity_consumed), 0) as total_consumed,
    COUNT(DISTINCT cc.pcb_production_id) as production_count,
    c.is_low_stock,
    CASE 
        WHEN c.monthly_required_quantity > 0 
        THEN ROUND((c.current_stock_quantity::NUMERIC / c.monthly_required_quantity * 100), 2)
        ELSE 0 
    END as stock_percentage
FROM components c
LEFT JOIN component_consumption cc ON c.id = cc.component_id
GROUP BY c.id, c.component_name, c.part_number, c.current_stock_quantity, 
         c.monthly_required_quantity, c.is_low_stock;

-- View: Top consumed components
CREATE OR REPLACE VIEW v_top_consumed_components AS
SELECT 
    c.component_name,
    c.part_number,
    SUM(cc.quantity_consumed) as total_consumed,
    COUNT(DISTINCT DATE(cc.consumption_date)) as consumption_days,
    AVG(cc.quantity_consumed) as avg_consumption_per_transaction
FROM components c
JOIN component_consumption cc ON c.id = cc.component_id
GROUP BY c.id, c.component_name, c.part_number
ORDER BY total_consumed DESC;

-- View: Low stock components
CREATE OR REPLACE VIEW v_low_stock_components AS
SELECT 
    c.component_name,
    c.part_number,
    c.current_stock_quantity,
    c.monthly_required_quantity,
    ROUND((c.current_stock_quantity::NUMERIC / NULLIF(c.monthly_required_quantity, 0) * 100), 2) as stock_percentage,
    pt.status as procurement_status,
    pt.trigger_date
FROM components c
LEFT JOIN LATERAL (
    SELECT status, trigger_date 
    FROM procurement_triggers 
    WHERE component_id = c.id 
    ORDER BY trigger_date DESC 
    LIMIT 1
) pt ON true
WHERE c.is_low_stock = true
ORDER BY stock_percentage ASC;

-- View: PCB production summary
CREATE OR REPLACE VIEW v_pcb_production_summary AS
SELECT 
    p.pcb_name,
    p.pcb_code,
    COUNT(pp.id) as total_productions,
    SUM(pp.quantity_produced) as total_quantity_produced,
    MAX(pp.production_date) as last_production_date
FROM pcbs p
LEFT JOIN pcb_production pp ON p.id = pp.pcb_id
GROUP BY p.id, p.pcb_name, p.pcb_code;

-- ============================================
-- SEED DATA (Optional - Admin User)
-- ============================================

-- Default admin password: 'admin123' (hashed with bcrypt - $2b$10$ prefix)
-- You should change this in production
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@electrolyte.com', '$2b$10$rXJx7Rf0aKv9LE9EFqFxUO8YZjHvKGQz9pGP3oDLKVJXJ9nHJvXjS', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE components IS 'Stores all electronic components used in PCB manufacturing';
COMMENT ON TABLE pcbs IS 'PCB definitions and specifications';
COMMENT ON TABLE pcb_components IS 'Bill of Materials - defines which components are used in each PCB';
COMMENT ON TABLE pcb_production IS 'Records of PCB production batches';
COMMENT ON TABLE component_consumption IS 'History of component usage';
COMMENT ON TABLE procurement_triggers IS 'Automated procurement alerts for low-stock components';
COMMENT ON TABLE stock_adjustments IS 'Manual stock adjustments and corrections';